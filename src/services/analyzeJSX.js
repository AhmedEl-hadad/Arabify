import { parse } from '@babel/parser';

import { injectProvider, injectToggle } from '../utils/reactInjector';

/**
 * Analyzes JSX/React code for inline styles, semantic structure, and accessibility.
 * Handles AST modifications for auto-fixing physical properties and injecting LanguageContext.
 * @param {string} codeString - The JSX code to analyze.
 * @param {object} text - The localization object.
 * @param {object} options - Configuration options.
 * @param {string} [options.mode='scan'] - Analysis mode ('scan', 'fix', 'multi-lang').
 * @param {boolean} [options.isAppFile=false] - Whether this is the main App component.
 * @returns {object} Result object containing score, warnings, foundTags, and fixedCode.
 */
const analyzeJSX = (codeString, text, options = { mode: 'scan', isAppFile: false }) => {
    let score = 100;
    let warnings = [];
    let fixedCode = null;

    let ast;
    try {
        ast = parse(codeString, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'classProperties', 'dynamicImport', 'exportDefaultFrom', 'exportNamespaceFrom', 'modules', 'objectRestSpread']
        });
    } catch (e) {
        // If parsing fails, return a fatal error or just basic score reduction
        console.error("JSX Parse Error:", e);
        return { score: 0, warnings: [{ type: "Syntax Error", msg: text.msgParseError, blogID: 0 }] };
    }

    // Helper to traverse AST
    const traverse = (node, visitor) => {
        if (!node || typeof node !== 'object') return;

        if (visitor[node.type]) {
            visitor[node.type](node);
        }

        for (const key in node) {
            if (key === 'loc' || key === 'start' || key === 'end' || key === 'comments') continue;
            const child = node[key];
            if (Array.isArray(child)) {
                child.forEach(c => traverse(c, visitor));
            } else if (child && typeof child === 'object') {
                traverse(child, visitor);
            }
        }
    };

    // State to track findings
    const foundTags = new Set();


    // Visitor
    const visitor = {
        ObjectExpression: (node) => {
            node.properties.forEach(prop => {
                if (!prop.key) return;
                const keyName = prop.key.name || prop.key.value;

                // 1. Check for Physical Properties (Keys)
                const physicalProps = [
                    'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight',
                    'left', 'right',
                    'borderLeft', 'borderRight', 'borderLeftWidth', 'borderRightWidth',
                    'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'
                ];

                if (physicalProps.includes(keyName)) {
                    score -= 5;
                    warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidPhysicalProp(keyName), blogID: 3 });
                }

                // 2. Check Values (textAlign, float)
                // Handle TSAsExpression (e.g. 'left' as const)
                let valueNode = prop.value;
                if (valueNode && valueNode.type === 'TSAsExpression') {
                    valueNode = valueNode.expression;
                }

                if (keyName === 'textAlign' || keyName === 'text-align') {
                    if (valueNode && (valueNode.value === 'left' || valueNode.value === 'right')) {
                        score -= 5;
                        warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidTextAlign, blogID: 3 });
                    }
                }
                if (keyName === 'float') {
                    if (valueNode && (valueNode.value === 'left' || valueNode.value === 'right')) {
                        score -= 5;
                        warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidFloat, blogID: 3 });
                    }
                }

                // 3. Check borderRadius shorthand (4 values)
                if (keyName === 'borderRadius') {
                    if (valueNode && valueNode.type === 'StringLiteral') {
                        const parts = valueNode.value.trim().split(/\s+/);
                        if (parts.length === 4) { // 4 values are direction sensitive (top-left, top-right, bottom-right, bottom-left)
                            score -= 5;
                            warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidBorderRadiusShorthand, blogID: 3 });
                        }
                    }
                }
            });
        },

        JSXOpeningElement: (node) => {
            const name = getJSXName(node.name);
            foundTags.add(name.toLowerCase());



            // Accessibility: img alt
            if (name === 'img') {
                const altAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'alt');
                if (!altAttr) {
                    score -= 5;
                    warnings.push({
                        type: text.errtypeAlt,
                        msg: text.msgMissingAlt("?"), // We don't have easy index here, using generic msg
                        blogID: 2
                    });
                }
            }

            // Accessibility: button aria-label
            if (name === 'button') {
                // Check if it has content (children) - this is hard in simple traversal without parent context or full subtree check
                // So we strictly check for aria-label or title if we can't easily check children text
                // For now, let's check if it has 'aria-label' or 'title'
                const hasLabel = node.attributes.some(attr =>
                    attr.type === 'JSXAttribute' && (attr.name.name === 'aria-label' || attr.name.name === 'title')
                );

                // We can't easily check if it has text content without looking at the closing element's parent's children.
                // But we can check if it's self-closing <button /> which is definitely bad if no label
                if (node.selfClosing && !hasLabel) {
                    score -= 5;
                    warnings.push({
                        type: text.errtypeAlt,
                        msg: text.msgEmptyButton,
                        blogID: 2
                    });
                }
            }

            // RTL: className strings
            const classAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && (attr.name.name === 'className' || attr.name.name === 'class'));
            if (classAttr && classAttr.value) {
                if (classAttr.value.type === 'StringLiteral') {
                    checkClassName(classAttr.value.value, warnings, text);
                } else if (classAttr.value.type === 'JSXExpressionContainer' && classAttr.value.expression.type === 'StringLiteral') {
                    checkClassName(classAttr.value.expression.value, warnings, text);
                }
            }
        }
    };

    traverse(ast, visitor);

    // Safety
    score = Math.max(0, score);

    // Structure Checks
    if (foundTags.has('main') || foundTags.has('body')) {
        if (!foundTags.has('header')) {
            score -= 5;
            warnings.push({ type: text.errtypeStructure, msg: text.msgMissingHeader, blogID: 1 });
        }
        if (!foundTags.has('footer')) {
            score -= 5;
            warnings.push({ type: text.errtypeStructure, msg: text.msgMissingFooter, blogID: 1 });
        }
    }

    // --- MULTI-LANG INJECTION & FIXES ---
    let modifiedCode = codeString;
    let injected = false;
    let styleFixed = false;
    
    // 0. Apply Style Fixes (Replacements)
    // We collect replacements during traversal. BUT we need to be careful.
    // Let's re-traverse or collect during the first pass.
    // To keep it simple and safe, let's collect findings in the main traversal and apply them here IF mode allows.
    
    if (options.mode === 'fix' || options.mode === 'multi-lang') {
        const replacements = [];
        const fixVisitor = {
             ObjectExpression: (node) => {
                node.properties.forEach(prop => {
                    if (!prop.key) return;
                    const keyName = prop.key.name || prop.key.value;
                    const valNode = prop.value;

                    // Helper to push replacement
                    const addReplacement = (start, end, text) => {
                        replacements.push({ start, end, text });
                    };

                    // KEY MAPPINGS
                    const keyMap = {
                        'marginLeft': 'marginInlineStart',
                        'marginRight': 'marginInlineEnd',
                        'paddingLeft': 'paddingInlineStart',
                        'paddingRight': 'paddingInlineEnd',
                        'borderLeft': 'borderInlineStart',
                        'borderRight': 'borderInlineEnd',
                        'borderTopLeftRadius': 'borderStartStartRadius',
                        'borderTopRightRadius': 'borderStartEndRadius',
                        'borderBottomLeftRadius': 'borderEndStartRadius',
                        'borderBottomRightRadius': 'borderEndEndRadius',
                        'left': 'insetInlineStart', // Positioning
                        'right': 'insetInlineEnd'
                    };

                    if (keyMap[keyName]) {
                        // Replace Key
                        addReplacement(prop.key.start, prop.key.end, keyMap[keyName]);
                    }

                    // VALUE MAPPINGS
                    // Handle literal strings
                    if (valNode && (valNode.type === 'StringLiteral' || valNode.type === 'Literal')) {
                        const val = valNode.value;
                        if (keyName === 'textAlign' || keyName === 'text-align') {
                            if (val === 'left') addReplacement(valNode.start, valNode.end, "'start'");
                            if (val === 'right') addReplacement(valNode.start, valNode.end, "'end'");
                        }
                        if (keyName === 'float') {
                            if (val === 'left') addReplacement(valNode.start, valNode.end, "'inline-start'");
                            if (val === 'right') addReplacement(valNode.start, valNode.end, "'inline-end'");
                        }
                        // Clear/Positioning? (Usually handled by CSS, but good to have)
                    }
                });
             }
        };

        // Run visitor to collect replacements
        traverse(ast, fixVisitor);

        if (replacements.length > 0) {
            // Sort Descending to prevent index shift
            replacements.sort((a, b) => b.start - a.start);
            
            // Apply replacements
            replacements.forEach(rep => {
                modifiedCode = modifiedCode.slice(0, rep.start) + rep.text + modifiedCode.slice(rep.end);
            });
            styleFixed = true;
        }
    }


    if (options.mode === 'multi-lang') {
        // 1. Inject Provider if it's the App File
        if (options.isAppFile) {
            modifiedCode = injectProvider(modifiedCode);
            injected = true;
        }

        // 2. Inject Toggle if it has Nav/Header
        if (foundTags.has('nav') || foundTags.has('header')) {
            modifiedCode = injectToggle(modifiedCode);
            injected = true;
        }
    }

    if (injected || styleFixed) {
        fixedCode = modifiedCode;
    }

    return { score, warnings, foundTags, fixedCode }; // Return foundTags & fixedCode
};

// Helper to get name from JSXMemberExpression (e.g. Components.Header)
const getJSXName = (node) => {
    if (node.type === 'JSXIdentifier') return node.name;
    if (node.type === 'JSXMemberExpression') {
        return `${getJSXName(node.object)}.${getJSXName(node.property)}`;
    }
    return '';
};

const checkClassName = (className, warnings, text) => {
    if (!className) return;

    // This is a loose check, might match "bright-color" which is false positive.
    // Better to check for word boundaries or specific tailwind classes
    // For now, let's look for "text-left", "text-right", "float-left", "float-right"

    if (/\btext-left\b/.test(className) || /\btext-right\b/.test(className)) {
        // We assume this is covered by general RTL warning or we add a new one
        // For now, let's just use the generic RTL msg
        warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidTextLeftRightClass, blogID: 3 });
    }

    if (/\b(ml-|mr-|pl-|pr-)\d+/.test(className)) {
        warnings.push({ type: text.errtypeRTL, msg: text.msgAvoidPhysicalMarginPaddingClass, blogID: 3 });
    }
};

export default analyzeJSX;
