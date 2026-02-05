import React, { useState, useContext } from 'react';
import './ConfigWizard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMagic, faGlobe, faTimes, faCode, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const ConfigWizard = ({ onStart, onCancel }) => {
    const { text } = useContext(LanguageContext);
    const [mode, setMode] = useState('fix-all'); // 'scan', 'fix-css', 'fix-lang', 'fix-all'
    const [projectType, setProjectType] = useState('react'); // 'react', 'vanilla'
    const [appFileName, setAppFileName] = useState('App.js');
    const [htmlFileName, setHtmlFileName] = useState('index.html');

    const handleStart = () => {
        onStart({
            mode,
            projectType,
            appFileName: projectType === 'vanilla' ? null : appFileName, // Ignore App.js for Vanilla
            htmlFileName
        });
    };

    return (
        <div className="wizard-overlay">
            <div className="wizard-card">
                <div className="wizard-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    <span style={{ flex: 1 }}>{text.wizardTitle}</span>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onCancel} style={{ fontSize: '1rem', cursor: 'pointer', opacity: 0.5 }} />
                </div>

                {/* 1. Project Type Selection */}
                <div className="wizard-section">
                    <h4>{text.projectType}</h4>
                    <div className="project-type-grid">
                        <div
                            className={`mode-option ${projectType === 'react' ? 'selected' : ''}`}
                            onClick={() => setProjectType('react')}
                        >
                            <FontAwesomeIcon icon={faReact} className="mode-icon" />
                            <span className="mode-label">{text.typeReact}</span>
                        </div>

                        <div
                            className={`mode-option ${projectType === 'vanilla' ? 'selected' : ''}`}
                            onClick={() => setProjectType('vanilla')}
                        >
                            <FontAwesomeIcon icon={faCode} className="mode-icon" />
                            <span className="mode-label">{text.typeVanilla}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Mode Selection */}
                <div className="wizard-section">
                    <h4>{text.modeSelect}</h4>
                    <div className="mode-grid">
                        <div
                            className={`mode-option ${mode === 'scan' ? 'selected' : ''}`}
                            onClick={() => setMode('scan')}
                        >
                            <FontAwesomeIcon icon={faSearch} className="mode-icon" />
                            <span className="mode-label">{text.modeScan}</span>
                        </div>

                        <div
                            className={`mode-option ${mode === 'fix-css' ? 'selected' : ''}`}
                            onClick={() => setMode('fix-css')}
                        >
                            <FontAwesomeIcon icon={faMagic} className="mode-icon" />
                            <span className="mode-label">{text.modeFixCSS}</span>
                        </div>

                         <div
                            className={`mode-option ${mode === 'fix-lang' ? 'selected' : ''}`}
                             onClick={() => setMode('fix-lang')}
                             style={{ opacity: projectType === 'vanilla' ? 0.5 : 1, pointerEvents: projectType === 'vanilla' ? 'none' : 'auto' }}
                        >
                            <FontAwesomeIcon icon={faGlobe} className="mode-icon" />
                            <span className="mode-label">{text.modeFixLang}</span>
                        </div>

                        <div
                            className={`mode-option ${mode === 'fix-all' ? 'selected' : ''}`}
                            onClick={() => setMode('fix-all')}
                             style={{ opacity: projectType === 'vanilla' ? 0.5 : 1, pointerEvents: projectType === 'vanilla' ? 'none' : 'auto' }}
                        >
                            <FontAwesomeIcon icon={faCheck} className="mode-icon" />
                            <span className="mode-label">{text.modeFixAll}</span>
                        </div>
                    </div>
                </div>

                {/* 3. File Config */}
                <div className="wizard-section">
                    <h4>{text.configFiles}</h4>

                    {/* Only allow editing main JS file if it's a React project */}
                    {projectType === 'react' && (
                        <div className="input-group">
                            <label>{text.mainJs}</label>
                            <input
                                type="text"
                                value={appFileName}
                                onChange={(e) => setAppFileName(e.target.value)}
                                placeholder="App.js"
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>{text.mainHtml}</label>
                        <input
                            type="text"
                            value={htmlFileName}
                            onChange={(e) => setHtmlFileName(e.target.value)}
                            placeholder="index.html"
                        />
                    </div>
                </div>

                <div className="wizard-actions">
                    <button className="wizard-btn btn-cancel" onClick={onCancel}>{text.cancelBtn}</button>
                    <button className="wizard-btn btn-start" onClick={handleStart}>{text.startBtn}</button>
                </div>

            </div>
        </div>
    );
};

export default ConfigWizard;
