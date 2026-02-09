
import analyzeA11Y from './analyzeA11Y';

const mockText = {
  errors: {},
};

describe('analyzeA11Y Service', () => {
    
  test('CSS: Should detect pixels > 10px', async () => {
    const css = `.foo { font-size: 16px; margin: 5px; }`;
    const result = await analyzeA11Y(css, 'css', mockText);
    
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'WARN_PX' })
      ])
    );
    expect(result.scoreDeduction).toBeGreaterThan(0);
  });

  test('CSS: Should NOT detect pixels <= 10px', async () => {
    const css = `.foo { border: 1px solid black; margin: 10px; }`;
    const result = await analyzeA11Y(css, 'css', mockText);
    
    // Should be empty or at least not have WARN_PX
    expect(result.warnings).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'WARN_PX' })])
    );
  });

  test('HTML: Should detect missing alt on images', async () => {
    const html = `<div><img src="foo.png" /></div>`;
    const result = await analyzeA11Y(html, 'html', mockText);

    expect(result.warnings).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ code: 'MISSING_ALT' })
        ])
    );
    expect(result.scoreDeduction).toBe(5);
  });

  test('HTML: Should NOT detect if alt is present', async () => {
    const html = `<div><img src="foo.png" alt="bar" /></div>`;
    const result = await analyzeA11Y(html, 'html', mockText);

    expect(result.warnings).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ code: 'MISSING_ALT' })])
    );
  });

  test('JSX: Should detect missing alt on images', async () => {
    const jsx = `const Foo = () => <img src="foo.png" />;`;
    const result = await analyzeA11Y(jsx, 'jsx', mockText);

    expect(result.warnings).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ code: 'MISSING_ALT' })
        ])
    );
  });
  
  test('JSX: Should detect empty button', async () => {
    const jsx = `const Foo = () => <button onClick={handleClick} />;`; // Self-closing no label
    const result = await analyzeA11Y(jsx, 'jsx', mockText);

    expect(result.warnings).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ code: 'EMPTY_BUTTON' })
        ])
    );
  });

  test('JSX: Should NOT detect button with aria-label', async () => {
    const jsx = `const Foo = () => <button aria-label="Click me" />;`; 
    const result = await analyzeA11Y(jsx, 'jsx', mockText);

    expect(result.warnings).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ code: 'EMPTY_BUTTON' })])
    );
  });

});
