import analyzeJSX from './analyzeJSX';

const mockText = {
    errtypeRTL: 'RTL Error',
    msgAvoidPhysicalProp: (p) => `Avoid ${p}`,
    msgAvoidTextAlign: 'Avoid textAlign',
    msgAvoidFloat: 'Avoid float',
    msgAvoidBorderRadiusShorthand: 'Avoid borderRadius shorthand'
};

describe('analyzeJSX Context-Aware Heuristics', () => {
    
    // 1. Strict Props: Always Warn
    test('Strict: Warns for marginLeft in generic object', () => {
        const code = `const data = { marginLeft: 10 };`;
        const result = analyzeJSX(code, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_PHYSICAL_PROP", args: ["marginLeft"] })])
        );
    });

    // 2. Ambiguous Props: Warn ONLY in Style Contexts

    // Case A: Prop Context (style={{ ... }})
    test('Ambiguous: Warns for left in style prop', () => {
        const code = `<div style={{ left: 10 }} />`;
        const result = analyzeJSX(code, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_PHYSICAL_PROP", args: ["left"] })])
        );
    });

    // Case B: Naming Context (const myStyle = { ... })
    test('Ambiguous: Warns for left in variable named *style*', () => {
        const code = `const myStyle = { left: 10 };`;
        const result = analyzeJSX(code, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_PHYSICAL_PROP", args: ["left"] })])
        );
    });

    // Case C: Sibling Context (has position: ...)
    test('Ambiguous: Warns for left if position is present', () => {
        const code = `const obj = { position: 'absolute', left: 10 };`;
        const result = analyzeJSX(code, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_PHYSICAL_PROP", args: ["left"] })])
        );
    });

    // Case D: NO Warning for Generic Data
    test('Ambiguous: IGNORES left in generic data object', () => {
        const code = `const data = { left: 10, name: 'Something' };`;
        const result = analyzeJSX(code, mockText);
        expect(result.warnings).not.toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_PHYSICAL_PROP", args: ["left"] })])
        );
    });

    // 3. TSAsExpression Support
    test('Handles TSAsExpression (textAlign: "left" as const)', () => {
        const code = `const styles = { textAlign: 'left' as const };`;
        const result = analyzeJSX(code, mockText, { fileName: 'test.ts' });
        expect(result.warnings).toEqual(
            expect.arrayContaining([expect.objectContaining({ code: "AVOID_TEXT_ALIGN" })])
        );
    });

    test('Handles TSAsExpression in strict prop mapping logic', () => {
        // If we map it to logical property, it should be ignored. 
        // But here let's test that it catches the physical prop first.
        // Actually, let's test the Mapping Heuristic: Ignore if value is logical.
        const code = `const s = { marginLeft: 'start' as const };`; 
        // 'start' is in LOGICAL_PROPS? Yes.
        const result = analyzeJSX(code, mockText, { fileName: 'test.ts' });
        // Should catch nothing? Wait, 'start' is logical? 
        // The implementation says: if (LOGICAL_PROPS.includes(valueStr)) return;
        // 'start' IS in LOGICAL_PROPS.
        expect(result.warnings).toHaveLength(0);
    });

    // 4. Fixing Checks (Mocking mode='fix')
    test('Fixes ambiguous prop in style context but NOT in generic context', () => {
        const code = `
            const s = { left: 10 }; // Generic name, but assuming no other context... wait this is just generic.
            const style = { left: 10 }; // Should fix
        `;
        const result = analyzeJSX(code, mockText, { mode: 'fix' });
        
        // The first one 's' should NOT be fixed (it's ambiguous and no context).
        // The second one 'style' SHOULD be fixed.
        
        expect(result.fixedCode).toContain(`const s = { left: 10 };`);
        expect(result.fixedCode).toContain(`const style = { insetInlineStart: 10 };`);
    });

});
