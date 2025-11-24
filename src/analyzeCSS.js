const analyzeCSS = (cssString, text) => {
  let score = 100;
  let warnings = [];
  let fixedCSS = cssString; // start with the original and modify it

  // --- CHECK SCROLL BEHAVIOR ---
  if (!fixedCSS.includes("scroll-behavior: smooth")) {
    score -= 10;
    warnings.push({
      type: "UX Fix",
      msg: text.fixScroll
    });
    // Auto-fix: Append it to the top of the file
    fixedCSS = "html { scroll-behavior: smooth; }\n" + fixedCSS;
  }

  // --- AUTOMATED RTL FIXES (Replacements) ---
  
  // Helper to run replace and log it
  const autoFix = (regex, replacement, message) => {
    if (fixedCSS.match(regex)) {
      // If we found a match, deduct score and log the fix
      score -= 5;
      warnings.push({
        type: "RTL Auto-Fix",
        msg: message
      });
      // Perform the replacement globally ('g')
      fixedCSS = fixedCSS.replace(regex, replacement);
    }
  };

  // Run the Fixers
  
  // Margins
  autoFix(/margin-left/g, "margin-inline-start", text.fixMarginLeft);
  autoFix(/margin-right/g, "margin-inline-end", text.fixMarginRight);
  
  // Paddings
  autoFix(/padding-left/g, "padding-inline-start", text.fixPaddingLeft);
  autoFix(/padding-right/g, "padding-inline-end", text.fixPaddingRight);

  // Borders (Physical sides -> Logical sides)
  autoFix(/border-left/g, "border-inline-start", "Replaced border-left with border-inline-start");
  autoFix(/border-right/g, "border-inline-end", "Replaced border-right with border-inline-end");

  // Text Align (Left -> Start, Right -> End)
  // We use regex with specific spacing checks so we don't break other words
  autoFix(/text-align:\s*left/g, "text-align: start", text.fixTextAlign);
  autoFix(/text-align:\s*right/g, "text-align: end", text.fixTextAlign);


  // --- PIXEL UNIT CHECK (Just Warning, No Auto-Fix) ---
  // don't auto-fix this because converting px to rem requires complex math 
  // and context (root font size) which we don't have.
  if (fixedCSS.match(/\d+px/g)) {
    score -= 5;
    warnings.push({
      type: "Responsiveness",
      msg: text.warnPx
    });
  }

  // Prevent negative score
  score = Math.max(0, score);

  return { score, warnings, fixedCSS };
};

export default analyzeCSS;