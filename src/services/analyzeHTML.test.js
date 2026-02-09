import analyzeHTML from './analyzeHTML';

// Mock text object
const mockText = {
    errtypeStructure: 'Structure Error',
    msgMissingHeader: 'Missing Header',
    msgMissingNav: 'Missing Nav',
    msgMissingFooter: 'Missing Footer',
    errtypeMeta: 'Meta Error',
    msgMissingMetaCharset: 'Missing Charset',
    msgMissingMetaViewport: 'Missing Viewport',
    msgMissingMetaDescription: 'Missing Description',
    msgMissingMetaKeywords: 'Missing Keywords',
    msgMissingMetaAuthor: 'Missing Author',
    errtypeLanguage: 'Language Error',
    msgMissingLangAttribute: 'Missing Lang',
    msgMissingDirAttribute: 'Missing Dir',
    errtypeAlt: 'Alt Error',
    msgMissingAlt: (i) => `Missing Alt ${i}`
};

describe('analyzeHTML', () => {
    test('returns 100 score for valid HTML structure', () => {
        const html = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <meta name="description" content="desc">
        <meta name="keywords" content="keys">
        <meta name="author" content="me">
      </head>
      <body>
        <header>Header</header>
        <nav>Nav</nav>
        <footer>Footer</footer>
      </body>
      </html>
    `;
        const result = analyzeHTML(html, mockText);
        expect(result.score).toBe(100);
        expect(result.warnings).toHaveLength(0);
    });

    test('detects missing semantic tags', () => {
        const html = `<div>Content</div>`;
        const result = analyzeHTML(html, mockText);
        expect(result.score).toBeLessThan(100);
        expect(result.warnings).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: 'MISSING_HEADER' }),
                expect.objectContaining({ code: 'MISSING_NAV' }),
                expect.objectContaining({ code: 'MISSING_FOOTER' })
            ])
        );
    });

    test('detects missing meta tags', () => {
        const html = `<html><head></head><body></body></html>`;
        const result = analyzeHTML(html, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: 'MISSING_META_CHARSET' }),
                expect.objectContaining({ code: 'MISSING_META_VIEWPORT' })
            ])
        );
    });

    test('detects missing lang/dir attributes', () => {
        const html = `<html><body></body></html>`;
        const result = analyzeHTML(html, mockText);
        expect(result.warnings).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: 'MISSING_LANG_ATTRIBUTE' }),
                expect.objectContaining({ code: 'MISSING_DIR_ATTRIBUTE' })
            ])
        );
    });

    // Alt attribute test moved to analyzeA11Y.test.js
    test('skips structure checks if isReact is true', () => {
        const html = '<!DOCTYPE html><html><body><div id="root"></div></body></html>';
        const result = analyzeHTML(html, mockText, { isMainFile: true, isReact: true });
        // Should NOT have structure warnings
        expect(result.warnings).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: 'MISSING_HEADER' }),
                expect.objectContaining({ code: 'MISSING_NAV' }),
                expect.objectContaining({ code: 'MISSING_FOOTER' })
            ])
        );
    });
});
