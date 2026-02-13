const { parse } = require('@babel/parser');

// Helper to manually traverse AST since we might not have @babel/traverse
const traverse = (node, visitor) => {
  if (!node || typeof node !== "object") return;

  if (visitor[node.type]) {
    visitor[node.type](node);
  }

  for (const key in node) {
    if (key === "loc" || key === "start" || key === "end" || key === "comments")
      continue;
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((c) => traverse(c, visitor));
    } else if (child && typeof child === "object") {
      traverse(child, visitor);
    }
  }
};

const injectProvider = (code) => {
  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript",
        "classProperties",
        "dynamicImport",
        "exportDefaultFrom",
        "exportNamespaceFrom",
      ],
    });
  } catch (e) {
    console.error("Parse Error in injectProvider:", e);
    return code;
  }

  let lastImportEnd = 0;
  let foundImport = false;
  let alreadyInjected = false;
  let exportDefaultNode = null;
  let exportDefaultDeclarationType = null; 
  let exportName = "App"; 
  let componentFunctionNode = null; 
  let potentialComponents = {}; 

  console.log("AST Parsed successfully");

  traverse(ast, {
    ImportDeclaration: (node) => {
      foundImport = true;
      if (node.end > lastImportEnd) lastImportEnd = node.end;
      if (node.source.value.includes("LanguageContext") || (node.specifiers.some(s => s.local.name === 'text' && s.local.name === 'useContext'))) {
          // Rudimentary check
      }
      if (code.slice(node.start, node.end).includes('LanguageContext')) {
          alreadyInjected = true;
      }
    },
    ExportDefaultDeclaration: (node) => {
      console.log("Found ExportDefaultDeclaration", node.declaration.type);
      exportDefaultNode = node;
      exportDefaultDeclarationType = node.declaration.type;
      
      if (node.declaration.type === "Identifier") {
        exportName = node.declaration.name;
        console.log("Export Name (Identifier):", exportName);
      } else if (
        node.declaration.type === "FunctionDeclaration" ||
        node.declaration.type === "ClassDeclaration"
      ) {
        if (node.declaration.id) {
          exportName = node.declaration.id.name;
          console.log("Export Name (Func/Class):", exportName);
        }
        componentFunctionNode = node.declaration;
      }
    },
    FunctionDeclaration: (node) => {
        if (node.id) {
            console.log("Found FunctionDeclaration:", node.id.name);
            potentialComponents[node.id.name] = node;
        }
    },
    ArrowFunctionExpression: (node) => {
    },
    VariableDeclarator: (node) => {
        if (node.id.type === 'Identifier' && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
             console.log("Found VariableDeclarator Component:", node.id.name);
             potentialComponents[node.id.name] = node.init;
        }
    },
    JSXOpeningElement: (node) => {
      if (node.name.name === "LanguageProvider") {
        alreadyInjected = true;
        console.log("Already Injected detected via JSX");
      }
    },
    CallExpression: (node) => {
      if (node.callee.name === 'useContext' && node.arguments.length > 0 && node.arguments[0].name === 'LanguageContext') {
          alreadyInjected = true;
          console.log("Already Injected detected via Hook Call");
      }
    }
  });

  if (!componentFunctionNode && exportDefaultDeclarationType === 'Identifier' && potentialComponents[exportName]) {
      console.log("Resolving component from potentialComponents:", exportName);
      componentFunctionNode = potentialComponents[exportName];
  } else {
      console.log("Component Resolution Failed or not needed. ComponentNode:", !!componentFunctionNode, "Type:", exportDefaultDeclarationType);
  }

  // Check for hook usage via AST only now. String check removed.

  if (alreadyInjected) {
      console.log("Skipping: Already Injected");
      return code;
  }
  if (!exportDefaultNode) {
      console.log("Skipping: No Export Default");
      return code; 
  }

  // --- EXECUTE INJECTION ---
  console.log("Proceeding with Injection...");
  
  // (Simulated injection logic)
  return "INJECTED";
};

const code = `import React from 'react';
import './App.css';
import UserCard from './components/UserCard';
import LanguageToggle from './components/LanguageToggle';


function App() {
  // Injector should add: const { text } = useContext(LanguageContext);
  // Injector should add: if (!text) return null;

  return (
    <div className="container clearfix">
      <header className="header">
        <h1>{text.welcomeTitle}</h1>
        <p>{text.welcomeDesc}</p>
        <LanguageToggle />
      </header>

      <main className="main-content">
        <h2>{text.aboutTitle}</h2>
        <p>
          {text.aboutDesc}
        </p>

        <h3>{text.featuresTitle}</h3>
        <ul className="feature-list">
          {text.featuresList.map((feature, index) => (
             <li key={index}>{feature}</li>
          ))}
        </ul>

        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {text.learnMoreBtn}
        </button>
      </main>

      <aside className="sidebar">
        <h3>{text.teamTitle}</h3>
        <p>{text.teamDesc}</p>
        
        <UserCard name="John Doe" role="Lead Developer" />
        <UserCard name="Sarah Smith" role="UI/UX Designer" />
      </aside>
    </div>
  );
}

export default App;`;

const result = injectProvider(code);
console.log("Result:", result === "INJECTED" ? "Success" : "Failed");
