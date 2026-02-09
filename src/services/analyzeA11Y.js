import postcss from 'postcss';
import safeParser from 'postcss-safe-parser';
import { parse } from '@babel/parser';

/**
 * Analyzes code for accessibility and best practices.
 * @param {string} content - The code content.
 * @param {string} type - The file type ('css', 'html', 'jsx').
 * @param {object} text - The localization object.
 * @returns {Promise<object>} Result object containing score deduction and warnings.
 */
const analyzeA11Y = async (content, type, text) => {
    switch (type) {
        case 'css':
            return await analyzeCSSA11Y(content, text);
        case 'html':
            return analyzeHTMLA11Y(content, text);
        case 'jsx':
            return analyzeJSXA11Y(content, text);
        default:
            return { scoreDeduction: 0, warnings: [] };
    }
};

const analyzeCSSA11Y = async (cssString, text) => {
    let scoreDeduction = 0;
    let warnings = [];

    const plugin = {
        postcssPlugin: 'arabify-a11y',
        Declaration(decl) {
             // Pixel Check
             if (decl.value && decl.value.includes('px')) {
                // Regex to find number before px
                const pxMatches = decl.value.match(/(\d*\.?\d+)px/g);
                if (pxMatches) {
                   const hasLargePixels = pxMatches.some(match => parseFloat(match) > 10);
                   if (hasLargePixels) {
                      if (decl.prop === 'width' && decl.value.endsWith('px')) {
                        const val = parseFloat(decl.value);
                        if (val > 300) { // arbitrary threshold for "large" px widths
                            scoreDeduction += 2;
                            warnings.push({
                                type: "errtypeResponsiveness",
                                code: "AVOID_LARGE_PX_WIDTH",
                                args: [decl.value],
                                blogID: 0
                            });
                        }
                   }
                   const alreadyWarned = warnings.some(w => w.code === "WARN_PX");
                   if (!alreadyWarned) {
                      scoreDeduction += 1;
                      warnings.push({
                        type: "errtypeResponsiveness",
                        code: "WARN_PX",
                        blogID: 4
                      });
                   }
                }
             }
          }
        }
    };

    try {
        await postcss([plugin]).process(cssString, { parser: safeParser, from: 'input.css' });
    } catch (e) {
        console.error("A11Y CSS Parse Error", e);
    }

    return { scoreDeduction, warnings };
};

const analyzeHTMLA11Y = (htmlString, text) => {
    let scoreDeduction = 0;
    let warnings = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Check Images for Alt
    const images = doc.querySelectorAll("img");
    images.forEach((img, index) => {
        if (!img.hasAttribute("alt")) {
            scoreDeduction += 5;
            warnings.push({
                type: "errtypeAlt",
                code: "MISSING_ALT",
                args: [index + 1],
                blogID: 2
            });
        }
    });

    // Check Empty Buttons
    const buttons = doc.querySelectorAll("button");
    buttons.forEach((btn) => {
        const hasContent = btn.textContent.trim().length > 0;
        const hasAriaLabel = btn.hasAttribute("aria-label");
        const hasTitle = btn.hasAttribute("title");
        
        if (!hasContent && !hasAriaLabel && !hasTitle) {
            scoreDeduction += 5;
            warnings.push({
                type: "errtypeAlt",
                code: "EMPTY_BUTTON",
                blogID: 2
            });
        }
    });

    return { scoreDeduction, warnings };
};

const analyzeJSXA11Y = (codeString, text) => {
    let scoreDeduction = 0;
    let warnings = [];
    let ast;

    try {
        ast = parse(codeString, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'classProperties', 'dynamicImport', 'exportDefaultFrom', 'exportNamespaceFrom', 'modules', 'objectRestSpread']
        });
    } catch (e) {
        return { scoreDeduction: 0, warnings: [] };
    }

    const traverse = (node, visitor) => {
        if (!node || typeof node !== 'object') return;
        if (visitor[node.type]) visitor[node.type](node);
        for (const key in node) {
            if (key === 'loc' || key === 'start' || key === 'end' || key === 'comments') continue;
            const child = node[key];
            if (Array.isArray(child)) child.forEach(c => traverse(c, visitor));
            else if (child && typeof child === 'object') traverse(child, visitor);
        }
    };

    // Helper to get name from JSXMemberExpression
    const getJSXName = (node) => {
        if (node.type === 'JSXIdentifier') return node.name;
        if (node.type === 'JSXMemberExpression') return `${getJSXName(node.object)}.${getJSXName(node.property)}`;
        return '';
    };

    const visitor = {
        JSXOpeningElement: (node) => {
            const name = getJSXName(node.name).toLowerCase();

            // Accessibility: img alt
            if (name === 'img') {
                const altAttr = node.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'alt');
                if (!altAttr) {
                    scoreDeduction += 5;
                    warnings.push({
                        type: "errtypeAlt",
                        code: "MISSING_ALT",
                        args: [],
                        blogID: 2
                    });
                }
            }

            // Accessibility: button aria-label
            if (name === 'button') {
                const hasLabel = node.attributes.some(attr =>
                    attr.type === 'JSXAttribute' && (attr.name.name === 'aria-label' || attr.name.name === 'title')
                );
                
                // If self-closing <button /> without label -> Bad
                if (node.selfClosing && !hasLabel) {
                    scoreDeduction += 5;
                    warnings.push({
                        type: "errtypeAlt",
                        code: "EMPTY_BUTTON",
                        blogID: 2
                    });
                }
            }
        }
    };

    traverse(ast, visitor);

    return { scoreDeduction, warnings };
};

export default analyzeA11Y;
