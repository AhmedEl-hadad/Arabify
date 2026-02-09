import { useState, useRef, useEffect, useContext } from 'react';
import SplitText from '../components/SplitText';
import CodeWindow from '../components/CodeWindow';
import analyzeHTML from '../services/analyzeHTML';
import analyzeCSS from '../services/analyzeCSS';
import analyzeJSX from '../services/analyzeJSX';
import analyzeA11Y from '../services/analyzeA11Y';
import ConfigWizard from '../components/ConfigWizard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUpload, faFile, faFolderOpen, faCode, faFileAlt, faFileImage, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { faReact, faHtml5, faCss3, faGithub } from '@fortawesome/free-brands-svg-icons';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import { LanguageContext } from '../contexts/LanguageContext';
import { contextTemplate, toggleTemplate } from '../utils/reactGenerators';
import { scanFiles } from '../utils/fileScanner';
import { content } from '../content';
import ProjectScoreCard from '../components/ProjectScoreCard';
import { calculateProjectScore } from '../utils/scoreCalculator';

const Home = () => {
    const { text, lang } = useContext(LanguageContext);
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState([]); // Array of { fileName, score, warnings, fixedCode, type }
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [analysisConfig, setAnalysisConfig] = useState(null);

  // Drag Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
    
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
    
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // 1. Capture all entries SYNCHRONOUSLY
    // accessing dataTransfer items must be done immediately
    const items = Array.from(e.dataTransfer.items);
    const entries = items.map(item => {
        if (item.webkitGetAsEntry) {
            return item.webkitGetAsEntry();
        }
        return null; // fallback or ignore
    }).filter(entry => entry !== null);

    // 2. Process entries ASYNCHRONOUSLY
    // We can now safely await without losing the list
    let allFiles = [];
    const scanPromises = entries.map(entry => scanFiles(entry));
    
    try {
        const results = await Promise.all(scanPromises);
        allFiles = results.flat();
        
        if (allFiles.length > 0) {
            addFiles(allFiles);
        }
    } catch (error) {
        console.error("Error scanning dropped files:", error);
    }
  };

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
        // Convert FileList to Array
        const files = Array.from(event.target.files);
        addFiles(files);
    }
  };
  

  const addFiles = async (newFiles) => {
      // 1. Filter duplicates
      const uniqueFiles = [];
      setUploadedFiles(prev => {
          const existingPaths = new Set(prev.map(f => f.path));
          
          for (const f of newFiles) {
              const path = f.path || f.webkitRelativePath || f.name;
               if (!existingPaths.has(path)) {
                   // Patch path if missing (for direct file uploads)
                   if (!f.path) f.path = path;
                   uniqueFiles.push(f);
                   existingPaths.add(path);
               }
          }
          return prev; // Warning: we are not updating state here yet, we need to read them first
      });

      if (uniqueFiles.length === 0) return;

      // 2. Read content
      const readPromises = uniqueFiles.map(file => {
          return new Promise((resolve) => {
            let type = 'unknown';
            if (file.name.endsWith('.css')) type = 'css';
            else if (file.name.endsWith('.html')) type = 'html';
            else if (file.name.endsWith('.jsx') || file.name.endsWith('.tsx') || file.name.endsWith('.js')) type = 'jsx';
    
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                path: file.path || file.webkitRelativePath || file.name, 
                content: event.target.result,
                type: type,
                originalFile: file 
              });
            };
            reader.readAsText(file);
          });
      });

      const processedFiles = await Promise.all(readPromises);
      
      // 3. Update State
      setUploadedFiles(prev => [...prev, ...processedFiles]);
  };
  
  const handleUploadClick = () => {
      fileInputRef.current.click();
  };


  // Trigger Analysis (Shows Wizard First)
  const initiateAnalysis = () => {
    if (uploadedFiles.length === 0) return;
    setShowWizard(true);
  };

  const handleWizardStart = (config) => {
    setAnalysisConfig(config);
    setShowWizard(false);
    runAnalysis(config);
  };

  const runAnalysis = async (config) => {
    setIsAnalyzing(true);
    const newResults = [];
    let allPerfect = true;
    
    // Track global project stats
    const projectStats = {
      foundTags: new Set()
    };

    for (const file of uploadedFiles) {
      // Only analyze supported types
      if (file.type === 'unknown') continue;

      let result = { fileName: file.name, path: file.path, type: file.type, score: 0, warnings: [], fixedCode: null };

      if (file.type === 'html') {
        const isMain = file.name === config.htmlFileName;
        // For Vanilla: Check structure locally on EVERY HTML file.
        // For React: Only check structure globally (aggregated later), so don't check locally here.
        const checkStructureLocally = config.projectType === 'vanilla';

        const { score, warnings, foundTags, fixedCode } = analyzeHTML(file.content, text, { 
            isMainFile: isMain,
            checkStructure: checkStructureLocally,
            mode: config.mode,
            isReact: config.projectType === 'react'
        });
        if (foundTags) foundTags.forEach(t => projectStats.foundTags.add(t));
        result = { ...result, score, warnings, fixedCode };
      } else if (file.type === 'css') {
        const { score, warnings, fixedCSS } = await analyzeCSS(file.content, text);
        // Only attach fixedCode if mode is 'fix' OR 'multi-lang'
        result = {
          ...result,
          score,
          warnings,
          fixedCode: (config.mode === 'fix-css' || config.mode === 'fix-all') ? fixedCSS : null
        };
      } else if (file.type === 'jsx') {
        const { score, warnings, foundTags, fixedCode } = analyzeJSX(file.content, text, {
             mode: config.mode,
             // Check exact name OR path ending (e.g. src/App.js)
             isAppFile: (file.name === config.appFileName || file.path.endsWith(`/${config.appFileName}`))
        });
        if (foundTags) foundTags.forEach(t => projectStats.foundTags.add(t));
        result = { ...result, score, warnings, fixedCode };

        // Multi-Lang Logic Check
        if ((config.mode === 'fix-lang' || config.mode === 'fix-all') && config.projectType !== 'vanilla' && file.name === config.appFileName) {
          // Simple Heuristic Check for Context/Provider/Dir Logic
          const content = file.content;
          // Looking for common patterns like <LanguageContext.Provider>, <IntlProvider>, or logic handling direction
          const hasLangLogic =
            content.includes('Context') ||
            content.includes('Provider') ||
            (content.includes('dir') && content.includes('?')); // rudimentary check for conditional dir

          if (!hasLangLogic) {
            result.score = Math.max(0, result.score - 20);
            result.warnings.push({
              type: "errtypeLanguage", // use existing key
              code: "MISSING_LANG_LOGIC",
              blogID: 5
            });
          }
        }
      }

      
      // --- Best Practices / A11Y Check ---
      if (config.mode === 'best-practices' || config.mode === 'full-best-practices') {
          const a11yResult = await analyzeA11Y(file.content, file.type, text);
          if (a11yResult) {
              result.score = Math.max(0, result.score - a11yResult.scoreDeduction);
              result.warnings.push(...a11yResult.warnings);
          }
      }
      
      if (result.score < 100) allPerfect = false;
      newResults.push(result);
    }

    // --- Post-Loop Global Checks (React Only) ---
    if (config.projectType === 'react') {
        const missingTags = [];
        if (!projectStats.foundTags.has('header')) missingTags.push('<header>');
        if (!projectStats.foundTags.has('footer')) missingTags.push('<footer>');
        if (!projectStats.foundTags.has('main')) missingTags.push('<main>');

        if (missingTags.length > 0) {
            // Find the main file to attach warnings to, or the first file
            const targetFileIndex = newResults.findIndex(r => r.fileName === config.appFileName);
            // If main file not found in results (e.g. not uploaded), attach to first result
            const finalTargetIndex = targetFileIndex !== -1 ? targetFileIndex : 0;
            
            if (newResults[finalTargetIndex]) {
                // Deduplicate local warnings
                missingTags.forEach(tag => {
                   const localCode = tag === '<header>' ? "MISSING_HEADER" :
                                    tag === '<footer>' ? "MISSING_FOOTER" :
                                    tag === '<main>' ? "MISSING_MAIN" : null;
                   
                   if (localCode) {
                       const originalLength = newResults[finalTargetIndex].warnings.length;
                       newResults[finalTargetIndex].warnings = newResults[finalTargetIndex].warnings.filter(w => w.code !== localCode);
                       if (newResults[finalTargetIndex].warnings.length < originalLength) {
                           // Refund the local penalty since we are replacing it with a global one
                           newResults[finalTargetIndex].score += 5; 
                       }
                   }
                });

                const globalWarnings = missingTags.map(tag => ({
                    type: "errtypeStructure",
                    code: "GLOBAL_MISSING_TAG",
                    args: [tag],
                    blogID: 1
                }));
                
                newResults[finalTargetIndex].warnings.push(...globalWarnings);
                // Deduct 10 points for each missing global structure item
                newResults[finalTargetIndex].score = Math.max(0, newResults[finalTargetIndex].score - (globalWarnings.length * 10));
                
                // Re-evaluate perfection if we added warnings
                if (newResults[finalTargetIndex].score < 100) allPerfect = false;
            }
        }
    }

    setResults(newResults);
    setIsAnalyzing(false);
    if (allPerfect && newResults.length > 0) {
      setConfettiKey(prev => prev + 1);
    }
  };

  const downloadAllFixed = async () => {
    const zip = new JSZip();

    // We want to include ALL uploaded files.
    // If a file was fixed, use the fixed content.
    // Otherwise, use the original content.

    uploadedFiles.forEach(file => {
      const fixedResult = results.find(r => r.path === file.path);
      const contentToSave = (fixedResult && fixedResult.fixedCode) ? fixedResult.fixedCode : file.content;

      // Use the relative path to preserve folder structure
      zip.file(file.path, contentToSave);
    });

    // --- MULTI-LANG INJECTION (React Only) ---
    if (analysisConfig && (analysisConfig.mode === 'fix-lang' || analysisConfig.mode === 'fix-all') && analysisConfig.projectType === 'react') {
        // Find the root folder (where App.js is located)
        // Heuristic: Use the folder containing the App File as the "src" root
        const appFile = uploadedFiles.find(f => f.name === analysisConfig.appFileName || f.path.endsWith(`/${analysisConfig.appFileName}`));
        let srcPrefix = '';
        if (appFile) {
            // e.g. "my-project/src/App.js" -> "my-project/src/"
            const parts = appFile.path.split('/');
            parts.pop(); // remove filename
            srcPrefix = parts.join('/') + (parts.length > 0 ? '/' : '');
        }

        // Add Context
        zip.file(srcPrefix + 'contexts/LanguageContext.js', contextTemplate);
        
        // Add Toggle (Assuming components folder implies src/components)
        // If srcPrefix ends in 'src/', we get 'src/components/LanguageToggle.js'
        zip.file(srcPrefix + 'components/LanguageToggle.js', toggleTemplate);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(content);
    element.download = "fixed-project.zip";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadSingleFile = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "fixed-" + filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      projectStats: {
        totalFiles: results.length,
        averageScore: calculateProjectScore(results, analysisConfig),
        displayScoreType: "Weighted (Main Files x2)",
        allPerfect: results.every(r => r.score === 100)
      },
      files: results.map(r => ({
        fileName: r.fileName,
        path: r.path,
        fileType: r.type,
        score: r.score,
        issues: r.warnings.map(w => {
          // ALWAYS USE ENGLISH FOR JSON REPORT
          let errorDef = content.en.errors[w.code];
          
          // Handle dynamic errors (functions)
          if (typeof errorDef === 'function') {
            errorDef = errorDef(...(w.args || []));
          }
          
          const messageText = errorDef ? errorDef.text : "Unknown Error";
            
          return {
            type: content.en[w.type] || w.type, // Resolve type code to English
            severity: "warning",
            code: w.code,
            message: messageText,
            documentationId: w.blogID
          };
        })
      }))
    };

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = "analysis-report.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper logic to pick the class
  const getResultClass = (score) => {
    if (score === 100) return "res-green";
    if (score >= 70) return "res-yellow";
    return "res-red";
  };

  // Helper to get icon based on file type
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) return faHtml5;
    if (fileName.endsWith('.css')) return faCss3;
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.tsx')) return faReact;
    if (fileName.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return faFileImage;
    return faFileAlt;
  };

  return (
    <div className="home-page">
      {showWizard && (
        <ConfigWizard
          onStart={handleWizardStart}
          onCancel={() => setShowWizard(false)}
        />
      )}

      <div>
        <section className='hero-section'>
          <SplitText
            text={text.heroText}
            className="hero-title"
            mode={lang === 'ar' ? 'words' : 'chars'}
            delay={50}
          />
          <div className="hero-content">
            <p className="hero-desc">{text.heropar}</p>
            <div className="btn-group">
              <a className="btn" href="#tool">{text.herobtn1}<FontAwesomeIcon icon={faCode} className="icons-start" /></a>
              <a className="btn" href="https://github.com/Taimkellizy/ArabifyByTaimKellizy">{text.herobtn2}<FontAwesomeIcon icon={faGithub} className="icons-start" /></a>
            </div>
          </div>
        </section>

        <section 
          className={`code-section ${isDragOver ? 'drag-active' : ''}`} 
          id="tool"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={isDragOver ? { borderColor: 'var(--primary)', backgroundColor: 'var(--bg-card-hover)' } : {}}
        >
          {/* THE CODE SECTION */}
          {uploadedFiles.length === 1 && (
            <div className="container">
              <CodeWindow
                code={uploadedFiles[0].content}
                fileName={uploadedFiles[0].name}
                language="javascript"
              />
            </div>
          )}

          {uploadedFiles.length > 1 && (
            <div className="container" style={{ padding: '20px' }}>
              <h3 className="file-list-header">
                {uploadedFiles.length} {text.files}
              </h3>
              <div className="file-grid">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="file-item">
                    <FontAwesomeIcon icon={getFileIcon(f.name)} className="file-icon" />
                    <span className="file-name" title={f.path}>
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNIFIED UPLOAD BUTTON */}
          {/* UNIFIED UPLOAD BUTTON */}
          {/* UNIFIED DROP ZONE UI */}

          {/* PERSISTENT HIDDEN INPUTS */}
           <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
            <input
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                ref={folderInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />

          {/* UNIFIED DROP ZONE UI */}
          {uploadedFiles.length === 0 && (
            <div className="upload-box">
              <div className="upload-icon-large">
                <FontAwesomeIcon icon={faUpload} />
              </div>
              <h3>{text.dragHint}</h3>
              <p className="upload-subtext">{text.supportedTypes}</p>
              
              <div className="upload-actions">
                <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
                    <FontAwesomeIcon icon={faFile} /> {text.uploadFiles}
                </button>
                <button className="btn-secondary" onClick={() => folderInputRef.current.click()}>
                    <FontAwesomeIcon icon={faFolderOpen} /> {text.uploadFolder}
                </button>
              </div>
            </div>
          )}


          {/* COMPACT HEADER FOR WHEN FILES EXIST */}
          {uploadedFiles.length > 0 && (
              <div className="section-header">
                <h2>{text.files}</h2>
                <div className="action-buttons">
                    <button className="btn-icon" onClick={() => fileInputRef.current.click()} title={text.uploadFiles}>
                        <FontAwesomeIcon icon={faFile} />
                    </button>
                    <button className="btn-icon" onClick={() => folderInputRef.current.click()} title={text.uploadFolder}>
                        <FontAwesomeIcon icon={faFolderOpen} />
                    </button>
                </div>
              </div>
          )}

        </section>

            {uploadedFiles.length > 0 && (
          <div className='analyse-btn'>
            <button onClick={initiateAnalysis} className="btn" disabled={isAnalyzing}>
              {isAnalyzing ? text.analyzing : text.analyzeBtn}
            </button>

            {results.some(r => r.fixedCode) && (
              <button onClick={uploadedFiles.length > 1 ? downloadAllFixed : () => downloadSingleFile(results[0].fixedCode, results[0].fileName)} className="btn">
                {uploadedFiles.length > 1 ? text.downloadZip : text.downloadFixed}
              </button>
            )}
            
            {results.length > 0 && (
                <button onClick={downloadReport} className="btn" style={{ gap: '10px' }}>
                    {text.downloadReport || "Download JSON Report"} <FontAwesomeIcon icon={faFileExport} />
                </button>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            {results.every(r => r.score === 100) && (
              <Confetti
                key={confettiKey}
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
                style={{ position: 'fixed', top: 0, insetInlineStart: 0, zIndex: 9999, pointerEvents: 'none' }}
              />
            )}
            
            {/* PROJECT SCORECARD - EXTRACTED */}
            <ProjectScoreCard 
                score={calculateProjectScore(results, analysisConfig)} 
                totalScoreLabel={text.totalScore} 
            />

            {results.map((res, idx) => (
              <div key={idx} className={`results-section ${getResultClass(res.score)}`} style={{ marginBottom: '20px' }}>
                <h3>{res.fileName} - {text.score} {res.score}/100</h3>

                  {Object.entries(
                    res.warnings.reduce((acc, warn) => {
                      const typeCode = warn.type || "Other";
                      // Group by the actual type key (e.g., errtypeRTL)
                      if (!acc[typeCode]) acc[typeCode] = [];
                      acc[typeCode].push(warn);
                      return acc;
                    }, {})
                  ).map(([typeCode, warnings], groupIdx) => (
                    <div key={groupIdx} className="warning-group">
                      <h4 className="warning-group-title">
                        {/* Resolve type code to localized text (e.g. text.errtypeRTL) */}
                        {text[typeCode] || typeCode}
                      </h4>
                    <ul className="warning-list">
                      {warnings.map((warn, index) => {
                        let errorDef = text.errors[warn.code];
                        
                        // Handle dynamic errors (functions)
                        if (typeof errorDef === 'function') {
                          errorDef = errorDef(...(warn.args || []));
                        }

                        const messageUI = errorDef ? errorDef.ui : "Unknown Error";

                        return (
                          <li key={index} className="warning-item">
                            {warn.blogID ? (
                              <Link
                                to={`/blog#post-${warn.blogID}`}
                                className="fix-link"
                              >
                                <span style={{ lineHeight: '1.5' }}>•</span>
                                <span>
                                  {messageUI}
                                  <span className="fix-link-text">
                                    {text.howToFix}
                                  </span>
                                </span>
                              </Link>
                            ) : (
                              <div className="warning-msg-container">
                                <span style={{ lineHeight: '1.5' }}>•</span>
                                <span>{messageUI}</span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
      {res.warnings.length === 0 && <p>{text.noIssues}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
