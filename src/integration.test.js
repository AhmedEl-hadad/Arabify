import analyzeHTML from './services/analyzeHTML';
import analyzeCSS from './services/analyzeCSS';
import analyzeJSX from './services/analyzeJSX';
import analyzeA11Y from './services/analyzeA11Y';
import { calculateProjectScore } from './utils/scoreCalculator';

// Mock analyzeA11Y since it's an external service in this context
jest.mock('./services/analyzeA11Y');

// Mock content object (as used in Home.js)
const mockText = {
    // HTML
    errtypeStructure: 'Structure Error',
    msgMissingHeader: 'Missing Header',
    msgMissingNav: 'Missing Nav',
    msgMissingFooter: 'Missing Footer',
    errtypeLanguage: 'Language Error',
    msgMissingLangAttribute: 'Missing Lang',
    msgMissingDirAttribute: 'Missing Dir',

    // CSS
    errtypeRTL: 'RTL Error',
    fixMarginLeft: 'Fix margin-left',
    
    // JSX
    msgAvoidPhysicalProp: (p) => `Avoid ${p}`,
    msgMissingAlt: (p) => `Missing alt ${p}`,
};

const runFullAnalysis = async (files, config) => {
    const results = [];
    
    for (const file of files) {
        let result = { fileName: file.name, path: file.path, type: file.type, score: 0, warnings: [], fixedCode: null };

        if (file.type === 'html') {
             // Simulate Home.js logic
            const isMain = file.name === config.htmlFileName;
            // For Vanilla: Check structure locally
            const checkStructureLocally = config.projectType === 'vanilla';
            
            const { score, warnings } = analyzeHTML(file.content, mockText, {
                 isMainFile: isMain,
                 checkStructure: checkStructureLocally,
                 mode: config.mode,
                 isReact: config.projectType === 'react'
            });
            result = { ...result, score, warnings };

        } else if (file.type === 'css') {
            const { score, warnings } = await analyzeCSS(file.content, mockText);
            result = { ...result, score, warnings };
        } else if (file.type === 'jsx') {
            const { score, warnings } = analyzeJSX(file.content, mockText, {
                mode: config.mode,
                isAppFile: (file.name === config.appFileName)
            });
             result = { ...result, score, warnings };
        }

        // --- Best Practices / A11Y Check (Simulated) ---
        if (config.mode === 'best-practices' || config.mode === 'full-best-practices') {
             // We need to call the mocked analyzeA11Y
             // effective integration testing would require unmocking or partial mocking, 
             // but here we just want to ensure the flow *calls* it if logic was duplicated.
             // However, since runFullAnalysis REPLICATES Home.js logic, we must Add the A11Y call here too
             // to match the implementation in Home.js!
             const a11yResult = await analyzeA11Y(file.content, file.type, mockText);
             if (a11yResult) {
                result.score = Math.max(0, result.score - a11yResult.scoreDeduction);
                result.warnings.push(...a11yResult.warnings);
            }
        }
        
        results.push(result);
    }
    
    const finalScore = calculateProjectScore(results, config);
    return { results, finalScore };
};

describe('Full Workflow Integration', () => {
    test('Analyzes a vanilla project with HTML and CSS issues', async () => {
        const files = [
            {
                name: 'index.html',
                path: 'index.html',
                type: 'html',
                content: '<html><body><div>No Semantic Tags</div></body></html>'
            },
            {
                name: 'style.css',
                path: 'style.css',
                type: 'css',
                content: '.box { margin-left: 10px; }' // RTL issue
            }
        ];

        const config = {
            projectType: 'vanilla',
            htmlFileName: 'index.html',
            mode: 'analyze'
        };

        const { results, finalScore } = await runFullAnalysis(files, config);

        // 1. Verify HTML Analysis
        const htmlResult = results.find(r => r.fileName === 'index.html');
        // HTML should look for missing Lang/Dir and Structure (Header, Nav, Footer)
        expect(htmlResult.warnings).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: 'MISSING_HEADER' }),
                expect.objectContaining({ code: 'MISSING_LANG_ATTRIBUTE' })
            ])
        );
        expect(htmlResult.score).toBeLessThan(100);

        // 2. Verify CSS Analysis
        const cssResult = results.find(r => r.fileName === 'style.css');
        expect(cssResult.warnings).toHaveLength(1);
        expect(cssResult.warnings[0].code).toBe('FIX_MARGIN_LEFT');
        expect(cssResult.score).toBeLessThan(100);

        // 3. Verify Final Score Calculation
        // index.html is Main -> Weight 2
        // style.css is Standard -> Weight 1 (based on scoreCalculator logic for 'style.css' vs 'app.css'?)
        // Wait, scoreCalculator.js defaults: ['app.css', 'index.css', 'index.html', 'app.js', 'app.jsx'] get weight 2.
        // 'style.css' is NOT in default list, so weight 1.
        
        // Let's calculate expected:
        // HTML Score: ~80? (Missing structure -30, missing meta/lang -10)
        // CSS Score: ~95? (1 issue)
        // verify exact logic in analyzers if needed, but integration test mostly checks flow
        
        expect(finalScore).toBeLessThan(100);
        expect(results).toHaveLength(2);
    });

    test('Analyzes a React project skipping local structure checks', async () => {
         const files = [
            {
                name: 'index.html',
                path: 'public/index.html',
                type: 'html',
                content: '<!DOCTYPE html><html><body><div id="root"></div></body></html>' // Minimal React HTML
            }
        ];
        
        const config = {
            projectType: 'react',
            htmlFileName: 'index.html',
             mode: 'analyze'
        };

         const { results } = await runFullAnalysis(files, config);
         const htmlResult = results[0];

         // React mode should SKIP missing header/footer warnings in index.html
         expect(htmlResult.warnings).not.toEqual(
             expect.arrayContaining([
                 expect.objectContaining({ msg: 'Missing Header' })
             ])
         );
         
         // But should still check for Lang/Dir
         expect(htmlResult.warnings).toEqual(
             expect.arrayContaining([
                  expect.objectContaining({ code: 'MISSING_LANG_ATTRIBUTE' })
             ])
         );
    });

    test('Runs Best Practices Analysis (A11Y)', async () => {
        // Setup mock return for A11Y
        analyzeA11Y.mockResolvedValue({
            scoreDeduction: 10,
            warnings: [{ code: 'MISSING_ALT', msg: 'Missing Alt' }]
        });

        const files = [
           {
               name: 'image.html',
               path: 'image.html',
               type: 'html',
               content: '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="description" content="test"><meta name="keywords" content="test"><meta name="author" content="test"><title>Test</title></head><body><header></header><nav></nav><main><img src="foo.jpg"></main><footer></footer></body></html>'
           }
       ];

       const config = {
           projectType: 'vanilla',
           htmlFileName: 'image.html',
           mode: 'best-practices'
       };

       const { results } = await runFullAnalysis(files, config);
       const result = results[0];

       expect(analyzeA11Y).toHaveBeenCalled();
       expect(result.warnings).toEqual(
           expect.arrayContaining([
               expect.objectContaining({ code: 'MISSING_ALT' })
           ])
       );
       expect(result.score).toBe(90); // 100 - 10
   });
});
