import React from 'react';
import './CodeWindow.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeWindow = ({ code, fileName, language = "javascript" }) => {
  return (
    <div className="code-window">
      <div className="window-header">
        {/* Use a fallback just in case state is empty string */}
        <div className="filename">{fileName || "code.js"}</div>
      </div>

      <div className="window-body">
        <SyntaxHighlighter 
          language={language} 
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: '#1e1e1e',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            minHeight: '200px',
          }}
          showLineNumbers={true}
          wrapLongLines={true} 
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeWindow;