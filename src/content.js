import React from "react";
import { CODE_SNIPPETS } from "./codeSnippets";

export const content = {
  en: {
    blog: "BLOG",
    contact: "CONTACT",
    toggleBtn: "AR",
    heroText: "Simplify your RTL & Accessibility",
    heropar:
      "Instant scans for RTL, AR-SEO, fonts, and accessibility. Fix hints + live preview.",
    herobtn1: "Try Now",
    herobtn2: "View Source",
    downloadFixed: "Download Fixed File",
    downloadReport: "Download JSON Report",
    analyzeBtn: "Analyze Code",
    score: "Score:",
    totalScore: "Total Arabification Score",
    copyrights: "© 2025 Arabify. Open Source (MIT License).",
    upFile: "Upload File",
    fileUped: "File Uploaded (Change?)",
    analyzing: "Analyzing...",
    downloadZip: "Download Project (Zip)",
    noIssues: "No issues found!",
    howToFix: "How to fix?",
    uploadFiles: "Upload File(s)",
    uploadFolder: "Upload Folder",
    upload: "Upload",
    files: "Files",
    dragHint: "Drag & drop files or folders anywhere here",
    supportedTypes: "Supported: .html, .css, .js, .jsx, images",

    // Wizard
    wizardTitle: "Analysis Configuration",
    modeSelect: "Select Analysis Mode",
    modeScan: "Quick Scan (Report Only)",
    modeFixCSS: "Auto-Fix CSS Only",
    modeFixLang: "Inject Language Button Only",
    modeBestPractices: "Best Practices (A11Y)",
    modeFixAll: "Full Fix (CSS + Language Button)",
    modeFullWithBestPractices: "Full Fix + Best Practices",
    modeMultiLang: "Multi-Language Setup & Checks",
    configFiles: "Project Configuration",
    mainJs: "Main React Entry File (e.g. App.js)",
    mainHtml: "Main HTML File (e.g. index.html)",
    startBtn: "Start Analysis",
    projectType: "Project Type",
    typeReact: "React.js",
    typeVanilla: "Vanilla (HTML/CSS/JS)",
    cancelBtn: "Cancel",

    // Error Types
    errtypeStructure: "HTML Structure",
    errPreSemantic: "We couldn't find a",
    errPostSemantic: "tag in the entire project.",
    errtypeAlt: "Accessibility",
    errtypeMeta: "SEO & Meta Tags",
    errtypeLanguage: "Language Configuration",
    errtypeRTL: "RTL Styling",
    errtypeResponsiveness: "Responsiveness",

    // --- ERROR DEFINITIONS (Structured for UI & JSON) ---
    errors: {
      // Structure
      MISSING_HEADER: {
        ui: (
          <>
            We couldn't find a <span className="en-code">&lt;header&gt;</span> tag.
            Consider replacing{" "}
            <span className="en-code">&lt;div className='header'&gt;</span> with{" "}
            <span className="en-code">&lt;header&gt;</span>.
          </>
        ),
        text: "We couldn't find a <header> tag. Consider replacing <div class='header'> with <header>."
      },
      MISSING_NAV: {
        ui: (
          <>
            We couldn't find a <span className="en-code">&lt;nav&gt;</span> tag.
            Consider replacing{" "}
            <span className="en-code">&lt;div className='nav'&gt;</span> with{" "}
            <span className="en-code">&lt;nav&gt;</span>.
          </>
        ),
        text: "We couldn't find a <nav> tag. Consider replacing <div class='nav'> with <nav>."
      },
      MISSING_FOOTER: {
        ui: (
          <>
            We couldn't find a <span className="en-code">&lt;footer&gt;</span> tag.
            Consider adding one for better structure.
          </>
        ),
        text: "We couldn't find a <footer> tag. Consider adding one for better structure."
      },
      MISSING_MAIN: {
        ui: (
          <>
            We couldn't find a <span className="en-code">&lt;main&gt;</span> tag.
            Consider wrapping your main content in{" "}
            <span className="en-code">&lt;main&gt;</span>.
          </>
        ),
        text: "We couldn't find a <main> tag. Consider wrapping your main content in <main>."
      },
      GLOBAL_MISSING_TAG: (tag) => ({
        ui: (
          <>
            We couldn't find a <span className="en-code">{tag}</span> tag in the
            entire project. (Global Check)
          </>
        ),
        text: `We couldn't find a ${tag} tag in the entire project. (Global Check)`
      }),

      // Accessibility
      MISSING_ALT: (id) => ({
        ui: (
          <>
            Image <span className="en-code">#{id}</span> is missing an 'alt'
            attribute.
          </>
        ),
        text: `Image #${id} is missing an 'alt' attribute.`
      }),
      EMPTY_BUTTON: {
        ui: "Empty button found without aria-label.",
        text: "Empty button found without aria-label."
      },

      // Meta / SEO
      MISSING_META_CHARSET: {
        ui: (
          <>
            Missing <span className="en-code">&lt;meta charset='utf-8'&gt;</span>{" "}
            tag for proper character encoding.
          </>
        ),
        text: "Missing <meta charset='utf-8'> tag for proper character encoding."
      },
      MISSING_META_VIEWPORT: {
        ui: (
          <>
            Missing <span className="en-code">&lt;meta name='viewport'...&gt;</span>{" "}
            tag for responsive design.
          </>
        ),
        text: "Missing <meta name='viewport'...> tag for responsive design."
      },
      MISSING_META_DESCRIPTION: {
        ui: (
          <>
            Missing{" "}
            <span className="en-code">&lt;meta name='description'...&gt;</span> tag
            for SEO.
          </>
        ),
        text: "Missing <meta name='description'...> tag for SEO."
      },
      MISSING_META_KEYWORDS: {
        ui: (
          <>
            Missing <span className="en-code">&lt;meta name='keywords'...&gt;</span>{" "}
            tag for SEO.
          </>
        ),
        text: "Missing <meta name='keywords'...> tag for SEO."
      },
      MISSING_META_AUTHOR: {
        ui: (
          <>
            Missing <span className="en-code">&lt;meta name='author'...&gt;</span>{" "}
            tag for SEO.
          </>
        ),
        text: "Missing <meta name='author'...> tag for SEO."
      },
      MISSING_LANG_ATTRIBUTE: {
        ui: (
          <>
            The <span className="en-code">&lt;html&gt;</span> tag is missing a{" "}
            <span className="en-code">lang</span> attribute.
          </>
        ),
        text: "The <html> tag is missing a lang attribute."
      },
      MISSING_DIR_ATTRIBUTE: {
        ui: (
          <>
            The <span className="en-code">&lt;html&gt;</span> tag is missing a{" "}
            <span className="en-code">dir</span> attribute.
          </>
        ),
        text: "The <html> tag is missing a dir attribute."
      },

      // Logic / Config
      MISSING_LANG_LOGIC: {
        ui: "Main App file seems to be missing Language Context or dynamic direction logic.",
        text: "Main App file seems to be missing Language Context or dynamic direction logic."
      },
      PARSE_ERROR: {
        ui: "Could not parse file. Please check for syntax errors.",
        text: "Could not parse file. Please check for syntax errors."
      },

      // RTL Styling Warnings
      AVOID_TEXT_ALIGN: {
        ui: (
          <>
            Avoid <span className="en-code">text-align: left/right</span>. Use{" "}
            <span className="en-code">start/end</span> for RTL support.
          </>
        ),
        text: "Avoid text-align: left/right. Use start/end for RTL support."
      },
      AVOID_FLOAT: {
        ui: (
          <>
            Avoid <span className="en-code">float: left/right</span>. Use CSS Grid
            or Flexbox for layout.
          </>
        ),
        text: "Avoid float: left/right. Use CSS Grid or Flexbox for layout."
      },
      AVOID_PHYSICAL_PROP: (key) => ({
        ui: (
          <>
            Avoid physical property <span className="en-code">'{key}'</span>. Use
            logical properties (e.g., marginInlineStart).
          </>
        ),
        text: `Avoid physical property '${key}'. Use logical properties (e.g., marginInlineStart).`
      }),
      AVOID_BORDER_RADIUS_SHORTHAND: {
        ui: "Avoid 4-value borderRadius shorthand. It is direction-sensitive.",
        text: "Avoid 4-value borderRadius shorthand. It is direction-sensitive."
      },
      AVOID_TEXT_LEFT_RIGHT_CLASS: {
        ui: "Avoid 'text-left'/'text-right'. Use logical alignment.",
        text: "Avoid 'text-left'/'text-right'. Use logical alignment."
      },
      AVOID_PHYSICAL_MARGIN_PADDING_CLASS: {
        ui: "Avoid physical margin/padding (ml-, mr-). Use logical properties (ms-, me-).",
        text: "Avoid physical margin/padding (ml-, mr-). Use logical properties (ms-, me-)."
      },

      // CSS Fixes/Warnings
      FIX_SCROLL: {
        ui: (
          <>
            Added <span className="en-code">scroll-behavior: smooth</span> to html
            for better user experience.
          </>
        ),
        text: "Added scroll-behavior: smooth to html for better user experience."
      },
      FIX_MARGIN_LEFT: {
        ui: (
          <>
            Found physical property <span className="en-code">margin-left</span>.
            Use <span className="en-code">margin-inline-start</span> for RTL
            support.
          </>
        ),
        text: "Found physical property margin-left. Use margin-inline-start for RTL support."
      },
      FIX_MARGIN_RIGHT: {
        ui: (
          <>
            Found physical property <span className="en-code">margin-right</span>.
            Use <span className="en-code">margin-inline-end</span> for RTL support.
          </>
        ),
        text: "Found physical property margin-right. Use margin-inline-end for RTL support."
      },
      FIX_PADDING_LEFT: {
        ui: (
          <>
            Found physical property <span className="en-code">padding-left</span>.
            Use <span className="en-code">padding-inline-start</span> for RTL
            support.
          </>
        ),
        text: "Found physical property padding-left. Use padding-inline-start for RTL support."
      },
      FIX_PADDING_RIGHT: {
        ui: (
          <>
            Found physical property <span className="en-code">padding-right</span>.
            Use <span className="en-code">padding-inline-end</span> for RTL support.
          </>
        ),
        text: "Found physical property padding-right. Use padding-inline-end for RTL support."
      },
      FIX_TEXT_ALIGN: {
        ui: (
          <>
            Found hardcoded <span className="en-code">text-align</span>. Use{" "}
            <span className="en-code">start/end</span> to align correctly in Arabic.
          </>
        ),
        text: "Found hardcoded text-align. Use start/end to align correctly in Arabic."
      },
      FIX_FLOAT: {
        ui: (
          <>
            Found physical float. Use{" "}
            <span className="en-code">inline-start/inline-end</span>.
          </>
        ),
        text: "Found physical float. Use inline-start/inline-end."
      },
      WARN_PX: {
        ui: (
          <>
            Found fixed <span className="en-code">px</span> values larger than 10px.
            Use <span className="en-code">rem</span> for fonts and spacing.
          </>
        ),
        text: "Found fixed px values larger than 10px. Use rem for fonts and spacing."
      },
      FIX_BORDER_LEFT: {
        ui: (
          <>
            Found physical <span className="en-code">border-left</span>. Use{" "}
            <span className="en-code">border-inline-start</span>.
          </>
        ),
        text: "Found physical border-left. Use border-inline-start."
      },
      FIX_BORDER_RIGHT: {
        ui: (
          <>
            Found physical <span className="en-code">border-right</span>. Use{" "}
            <span className="en-code">border-inline-end</span>.
          </>
        ),
        text: "Found physical border-right. Use border-inline-end."
      },
      FIX_BORDER_TOP_LEFT_RADIUS: {
        ui: (
          <>
            Found physical <span className="en-code">border-top-left-radius</span>.
            Use <span className="en-code">border-start-start-radius</span>.
          </>
        ),
        text: "Found physical border-top-left-radius. Use border-start-start-radius."
      },
      FIX_BORDER_TOP_RIGHT_RADIUS: {
        ui: (
          <>
            Found physical <span className="en-code">border-top-right-radius</span>.
            Use <span className="en-code">border-start-end-radius</span>.
          </>
        ),
        text: "Found physical border-top-right-radius. Use border-start-end-radius."
      },
      FIX_BORDER_BOTTOM_RIGHT_RADIUS: {
        ui: (
          <>
            Found physical{" "}
            <span className="en-code">border-bottom-right-radius</span>. Use{" "}
            <span className="en-code">border-end-end-radius</span>.
          </>
        ),
        text: "Found physical border-bottom-right-radius. Use border-end-end-radius."
      },
      FIX_BORDER_BOTTOM_LEFT_RADIUS: {
        ui: (
          <>
            Found physical{" "}
            <span className="en-code">border-bottom-left-radius</span>. Use{" "}
            <span className="en-code">border-end-start-radius</span>.
          </>
        ),
        text: "Found physical border-bottom-left-radius. Use border-end-start-radius."
      },
      FIX_BORDER_RADIUS_SHORTHAND: {
        ui: (
          <>
            Found physical <span className="en-code">border-radius</span> shorthand.
            Use logical properties.
          </>
        ),
        text: "Found physical border-radius shorthand. Use logical properties."
      },
      FIX_LEFT_POSITION: {
        ui: (
          <>
            Found physical positioning <span className="en-code">left</span>. Use{" "}
            <span className="en-code">inset-inline-start</span>.
          </>
        ),
        text: "Found physical positioning left. Use inset-inline-start."
      },
      FIX_RIGHT_POSITION: {
        ui: (
          <>
            Found physical positioning <span className="en-code">right</span>. Use{" "}
            <span className="en-code">inset-inline-end</span>.
          </>
        ),
        text: "Found physical positioning right. Use inset-inline-end."
      }
    },

    // New Blog Specific Labels
    blogSubtitle:
      "Your comprehensive guide to Accessibility, RTL support, and Modern CSS.",
    blogFixLabel: "💡 The Fix:",
    videoWatch: "Watch:",

    // The Blog Data
    blogPosts: [
      {
        id: 1,
        title: "1. Structure and Semantics",
        desc: "Using generic <div> tags for everything makes your website a 'black box' to screen readers. Assistive technologies rely on Landmarks to navigate.",
        fix: "Replace generic divs with standard HTML5 tags.",
        code: CODE_SNIPPETS.structure,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=vAAzdi1xuUY",
        videoTitle: "Why headings and landmarks are so important",
      },
      {
        id: 2,
        title: "2. Images and Alt Text",
        desc: "When an image is missing the 'alt' attribute, screen readers read the file name (e.g., IMG_5922.jpg). Search engines can't 'see' your images without it.",
        fix: "Always add a descriptive alt attribute. If decorative, use an empty string.",
        code: CODE_SNIPPETS.images,
        language: "html",
        videoUrl: "https://youtu.be/JP2VkfYF5HU?si=-ZD5xE142ZG8ClGn&t=166",
        videoTitle: "Why you should start using ARIA Attributes in HTML",
      },
      {
        id: 3,
        title: "3. CSS Logical Properties",
        desc: "Traditionally we used Left and Right. This breaks layouts in Arabic because margins don't flip automatically.",
        fix: "We use 'Start' and 'End'. The browser automatically flips them based on the document direction.",
        code: CODE_SNIPPETS.logicalProperties,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=wPvXHiHHSgY",
        videoTitle: "Everything you need to know about CSS Logical Properties",
      },
      {
        id: 4,
        title: "4. Pixels (px) vs. REM",
        desc: "Pixels are absolute. If a visually impaired user increases their browser font size, px-based text won't scale.",
        fix: "Use 'rem'. 1rem equals the user's default browser font size and scales automatically.",
        code: CODE_SNIPPETS.remUnits,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=okw-whFWGEo",
        videoTitle:
          "Stop using pixels in your CSS! How and why to use REM and EM.",
      },
      {
        id: 5,
        title: "5. HTML Language and Direction",
        desc: "Without a 'lang' attribute, screen readers will read Arabic with an English accent (unintelligible). Without 'dir=rtl', the browser assumes Left-to-Right layout, breaking the reading order.",
        fix: "Always declare the language and direction on the HTML tag.",
        code: CODE_SNIPPETS.langDir,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=cOmehxAU_4s",
        videoTitle: "How I do an accessibility check",
      },
      {
        id: 6,
        title: "6. Essential Meta Tags",
        desc: "Meta tags are invisible to users but critical for browsers and bots. Missing the 'viewport' tag causes your site to look tiny on mobile phones. Missing 'description' hurts your SEO.",
        fix: "Include standard meta tags in your <head>.",
        code: CODE_SNIPPETS.metaTags,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=WecWWZifXB4",
        videoTitle: "Learn HTML Meta-Tags in 4 Minutes!",
      },
      {
        id: 7,
        title: "7. Text Alignment",
        desc: "Forcing 'text-align: left' on an Arabic paragraph makes it look ragged and hard to read. Arabic is read from Right to Left.",
        fix: "Avoid 'left' or 'right'. Use 'start' and 'end' to let the browser decide based on the language.",
        code: CODE_SNIPPETS.textAlign,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=wPvXHiHHSgY",
        videoTitle: "Everything you need to know about CSS Logical Properties",
      },
      {
        id: 8,
        title: "8. Handling Variable Collisions",
        desc: "What if you already use a variable named 'text' or 'data'? Our tool automatically aliases it, but you can also rename it manually.",
        fix: "Destructure with a new name: const { text: myCustomName } = useContext(LanguageContext);",
        code: `// If you have: const text = "My Local String";
// The injector does this:
const { text: arabifyContextvalue } = useContext(LanguageContext);

// You can manually change it to:
const { text: appText } = useContext(LanguageContext);
// Now use {appText.welcome} in your JSX.`,
        language: "javascript",
        videoUrl: "",
        videoTitle: "Documentation: Customizing Injection",
      },
    ],
  },

  ar: {
    blog: "مدونة",
    contact: "تواصل معنا",
    toggleBtn: "EN",
    heroText: "ظبط محركات البحث و التعريب بشكل مبسط.",
    heropar:
      "فحوصات فورية لمحركات البحث، الخطوط، وسهولة الوصول. نصائح للإصلاح + معاينة مباشرة.",
    herobtn1: "جرب فحص سريع",
    herobtn2: "عرض المصدر",
    downloadFixed: "تحميل الكود المصحح",
    downloadReport: "تحميل تقرير JSON",
    analyzeBtn: "تحليل الكود",
    score: "النقاط:",
    totalScore: "نسبة التعريب الكلية",
    copyrights: "© 2025 عَرِّب. مفتوح المصدر (رخصة MIT).",
    upFile: "رفع ملف",
    fileUped: "تم رفع الملف (تغيير؟)",
    analyzing: "جاري التحليل...",
    downloadZip: "تحميل المشروع (Zip)",
    noIssues: "لم يتم العثور على مشاكل!",
    howToFix: "كيف أصلحه؟",
    uploadFiles: "رفع ملفات",
    uploadFolder: "رفع مجلد",
    upload: "رفع",
    files: "ملفات",
    dragHint: "اسحب وأفلت الملفات أو المجلدات هنا",
    supportedTypes: "ندعم: .html, .css, .js, .jsx, والصور",

    // Wizard
    wizardTitle: "إعدادات التحليل",
    modeSelect: "اختر وضع التحليل",
    modeScan: "فحص سريع (تقرير فقط)",
    modeFixCSS: "إصلاح تلقائي للـ CSS فقط",
    modeFixLang: "إضافة زر اللغة فقط",
    modeBestPractices: "أفضل الممارسات (A11Y)",
    modeFixAll: "إصلاح شامل (CSS + زر اللغة)",
    modeFullWithBestPractices: "إصلاح شامل + أفضل الممارسات",
    modeMultiLang: "إعداد وتدقيق تعدد اللغات",
    configFiles: "إعدادات المشروع",
    mainJs: "ملف React الرئيسي (مثل App.js)",
    mainHtml: "ملف HTML الرئيسي (مثل index.html)",
    startBtn: "ابـدأ التحليل",
    projectType: "نوع المشروع",
    typeReact: "React.js",
    typeVanilla: "إعتيادي (HTML/CSS/JS)",
    cancelBtn: "إلغاء",

    errtypeStructure: "هيكلية الصفحة",
    errPreSemantic: "لم نتمكن من العثور على وسم",
    errPostSemantic: "في المشروع بالكامل.",
    errtypeAlt: "سهولة الوصول",
    errtypeMeta: "تحسين محركات البحث (SEO)",
    errtypeLanguage: "إعدادات اللغة",
    errtypeRTL: "دعم العربية (RTL)",
    errtypeResponsiveness: "التجاوب",

    // --- ERROR DEFINITIONS (Structured for UI & JSON) ---
    errors: {
      // Structure
      MISSING_HEADER: {
        ui: (
          <>
            لم نتمكن من العثور على وسم <span className="en-code">&lt;header&gt;</span>.
            فكر في استبدال{" "}
            <span className="en-code">&lt;div className='header'&gt;</span> بـ{" "}
            <span className="en-code">&lt;header&gt;</span>.
          </>
        ),
        text: "لم نتمكن من العثور على وسم <header>. فكر في استبدال <div class='header'> بـ <header>."
      },
      MISSING_NAV: {
        ui: (
          <>
            لم نتمكن من العثور على وسم <span className="en-code">&lt;nav&gt;</span>.
            فكر في استبدال{" "}
            <span className="en-code">&lt;div className='nav'&gt;</span> بـ{" "}
            <span className="en-code">&lt;nav&gt;</span>.
          </>
        ),
        text: "لم نتمكن من العثور على وسم <nav>. فكر في استبدال <div class='nav'> بـ <nav>."
      },
      MISSING_FOOTER: {
        ui: (
          <>
            لم نتمكن من العثور على وسم{" "}
            <span className="en-code">&lt;footer&gt;</span>. فكر في إضافة واحد
            لتحسين الهيكلية.
          </>
        ),
        text: "لم نتمكن من العثور على وسم <footer>. فكر في إضافة واحد لتحسين الهيكلية."
      },
      MISSING_MAIN: {
        ui: (
          <>
            لم نتمكن من العثور على وسم <span className="en-code">&lt;main&gt;</span>
            . فكر في تغليف المحتوى الرئيسي بـ{" "}
            <span className="en-code">&lt;main&gt;</span>.
          </>
        ),
        text: "لم نتمكن من العثور على وسم <main>. فكر في تغليف المحتوى الرئيسي بـ <main>."
      },
      GLOBAL_MISSING_TAG: (tag) => ({
        ui: (
          <>
            لم نتمكن من العثور على وسم <span className="en-code">{tag}</span> في
            المشروع بالكامل. (فحص شامل)
          </>
        ),
        text: `لم نتمكن من العثور على وسم ${tag} في المشروع بالكامل. (فحص شامل)`
      }),

      // Accessibility
      MISSING_ALT: (id) => ({
        ui: (
          <>
            الصورة رقم <span className="en-code">#{id}</span> تفتقد وسم{" "}
            <span className="en-code">alt</span>.
          </>
        ),
        text: `الصورة رقم #${id} تفتقد وسم alt.`
      }),
      EMPTY_BUTTON: {
        ui: "تم العثور على زر فارغ بدون تسمية (aria-label).",
        text: "تم العثور على زر فارغ بدون تسمية (aria-label)."
      },

      // Meta / SEO
      MISSING_META_CHARSET: {
        ui: (
          <>
            يفتقد وسم <span className="en-code">&lt;meta charset='utf-8'&gt;</span>{" "}
            لترميز الأحرف بشكل صحيح.
          </>
        ),
        text: "يفتقد وسم <meta charset='utf-8'> لترميز الأحرف بشكل صحيح."
      },
      MISSING_META_VIEWPORT: {
        ui: (
          <>
            يفتقد وسم{" "}
            <span className="en-code">&lt;meta name='viewport'...&gt;</span> لتصميم
            متجاوب.
          </>
        ),
        text: "يفتقد وسم <meta name='viewport'...> لتصميم متجاوب."
      },
      MISSING_META_DESCRIPTION: {
        ui: (
          <>
            يفتقد وسم{" "}
            <span className="en-code">&lt;meta name='description'...&gt;</span> لضبط
            محركات البحث.
          </>
        ),
        text: "يفتقد وسم <meta name='description'...> لضبط محركات البحث."
      },
      MISSING_META_KEYWORDS: {
        ui: (
          <>
            يفتقد وسم{" "}
            <span className="en-code">&lt;meta name='keywords'...&gt;</span> لضبط
            محركات البحث.
          </>
        ),
        text: "يفتقد وسم <meta name='keywords'...> لضبط محركات البحث."
      },
      MISSING_META_AUTHOR: {
        ui: (
          <>
            يفتقد وسم <span className="en-code">&lt;meta name='author'...&gt;</span>{" "}
            لضبط محركات البحث.
          </>
        ),
        text: "يفتقد وسم <meta name='author'...> لضبط محركات البحث."
      },
      MISSING_LANG_ATTRIBUTE: {
        ui: (
          <>
            وسم <span className="en-code">&lt;html&gt;</span> يفتقد وسم{" "}
            <span className="en-code">lang</span>.
          </>
        ),
        text: "وسم <html> يفتقد وسم lang."
      },
      MISSING_DIR_ATTRIBUTE: {
        ui: (
          <>
            وسم <span className="en-code">&lt;html&gt;</span> يفتقد وسم{" "}
            <span className="en-code">dir</span>.
          </>
        ),
        text: "وسم <html> يفتقد وسم dir."
      },

      // Logic / Config
      MISSING_LANG_LOGIC: {
        ui: "يبدو أن ملف التطبيق الرئيسي يفتقد سياق اللغة أو منطق الاتجاه الديناميكي.",
        text: "يبدو أن ملف التطبيق الرئيسي يفتقد سياق اللغة أو منطق الاتجاه الديناميكي."
      },
      PARSE_ERROR: {
        ui: "لم نتمكن من تحليل الملف. يرجى التحقق من وجود أخطاء في بناء الجملة.",
        text: "لم نتمكن من تحليل الملف. يرجى التحقق من وجود أخطاء في بناء الجملة."
      },

      // RTL Styling
      AVOID_TEXT_ALIGN: {
        ui: (
          <>
            تجنب استخدام <span className="en-code">text-align: left/right</span>.
            استخدم <span className="en-code">start/end</span> لدعم العربية.
          </>
        ),
        text: "تجنب استخدام text-align: left/right. استخدم start/end لدعم العربية."
      },
      AVOID_FLOAT: {
        ui: (
          <>
            تجنب استخدام <span className="en-code">float: left/right</span>. استخدم
            CSS Grid أو Flexbox للتخطيط.
          </>
        ),
        text: "تجنب استخدام float: left/right. استخدم CSS Grid أو Flexbox للتخطيط."
      },
      AVOID_PHYSICAL_PROP: (key) => ({
        ui: (
          <>
            تجنب الخاصية المادية <span className="en-code">'{key}'</span>. استخدم
            الخصائص المنطقية (مثل marginInlineStart).
          </>
        ),
        text: `تجنب الخاصية المادية '${key}'. استخدم الخصائص المنطقية (مثل marginInlineStart).`
      }),
      AVOID_BORDER_RADIUS_SHORTHAND: {
        ui: "تجنب اختصار borderRadius بـ 4 قيم. إنه حساس للاتجاه.",
        text: "تجنب اختصار borderRadius بـ 4 قيم. إنه حساس للاتجاه."
      },
      AVOID_TEXT_LEFT_RIGHT_CLASS: {
        ui: "تجنب 'text-left'/'text-right'. استخدم المحاذاة المنطقية.",
        text: "تجنب 'text-left'/'text-right'. استخدم المحاذاة المنطقية."
      },
      AVOID_PHYSICAL_MARGIN_PADDING_CLASS: {
        ui: "تجنب هوامش/حواشي مادية (ml-, mr-). استخدم خصائص منطقية (ms-, me-).",
        text: "تجنب هوامش/حواشي مادية (ml-, mr-). استخدم خصائص منطقية (ms-, me-)."
      },

      // CSS Fixes/Warnings
      FIX_SCROLL: {
        ui: (
          <>
            تم إضافة <span className="en-code">scroll-behavior: smooth</span> لتحسين
            تجربة التمرير.
          </>
        ),
        text: "تم إضافة scroll-behavior: smooth لتحسين تجربة التمرير."
      },
      FIX_MARGIN_LEFT: {
        ui: (
          <>
            تم العثور على <span className="en-code">margin-left</span>. استخدم{" "}
            <span className="en-code">margin-inline-start</span> لدعم العربية.
          </>
        ),
        text: "تم العثور على margin-left. استخدم margin-inline-start لدعم العربية."
      },
      FIX_MARGIN_RIGHT: {
        ui: (
          <>
            تم العثور على <span className="en-code">margin-right</span>. استخدم{" "}
            <span className="en-code">margin-inline-end</span> لدعم العربية.
          </>
        ),
        text: "تم العثور على margin-right. استخدم margin-inline-end لدعم العربية."
      },
      FIX_PADDING_LEFT: {
        ui: (
          <>
            تم العثور على <span className="en-code">padding-left</span>. استخدم{" "}
            <span className="en-code">padding-inline-start</span> لدعم العربية.
          </>
        ),
        text: "تم العثور على padding-left. استخدم padding-inline-start لدعم العربية."
      },
      FIX_PADDING_RIGHT: {
        ui: (
          <>
            تم العثور على <span className="en-code">padding-right</span>. استخدم{" "}
            <span className="en-code">padding-inline-end</span> لدعم العربية.
          </>
        ),
        text: "تم العثور على padding-right. استخدم padding-inline-end لدعم العربية."
      },
      FIX_TEXT_ALIGN: {
        ui: (
          <>
            تم العثور على <span className="en-code">text-align</span> ثابت. استخدم{" "}
            <span className="en-code">start/end</span> لضمان المحاذاة الصحيحة.
          </>
        ),
        text: "تم العثور على text-align ثابت. استخدم start/end لضمان المحاذاة الصحيحة."
      },
      FIX_FLOAT: {
        ui: (
          <>
            تم العثور على <span className="en-code">float</span> مادي. استخدم{" "}
            <span className="en-code">inline-start/inline-end</span>.
          </>
        ),
        text: "تم العثور على float مادي. استخدم inline-start/inline-end."
      },
      WARN_PX: {
        ui: (
          <>
            تم العثور على قيم <span className="en-code">px</span> أكبر من 10px.
            استخدم <span className="en-code">rem</span> للخطوط والمسافات.
          </>
        ),
        text: "تم العثور على قيم px أكبر من 10px. استخدم rem للخطوط والمسافات."
      },
      FIX_BORDER_LEFT: {
        ui: (
          <>
            تم العثور على <span className="en-code">border-left</span> مادي. استخدم{" "}
            <span className="en-code">border-inline-start</span>.
          </>
        ),
        text: "تم العثور على border-left مادي. استخدم border-inline-start."
      },
      FIX_BORDER_RIGHT: {
        ui: (
          <>
            تم العثور على <span className="en-code">border-right</span> مادي. استخدم{" "}
            <span className="en-code">border-inline-end</span>.
          </>
        ),
        text: "تم العثور على border-right مادي. استخدم border-inline-end."
      },
      FIX_BORDER_TOP_LEFT_RADIUS: {
        ui: (
          <>
            تم العثور على <span className="en-code">border-top-left-radius</span>{" "}
            مادي. استخدم <span className="en-code">border-start-start-radius</span>.
          </>
        ),
        text: "تم العثور على border-top-left-radius مادي. استخدم border-start-start-radius."
      },
      FIX_BORDER_TOP_RIGHT_RADIUS: {
        ui: (
          <>
            تم العثور على <span className="en-code">border-top-right-radius</span>{" "}
            مادي. استخدم <span className="en-code">border-start-end-radius</span>.
          </>
        ),
        text: "تم العثور على border-top-right-radius مادي. استخدم border-start-end-radius."
      },
      FIX_BORDER_BOTTOM_RIGHT_RADIUS: {
        ui: (
          <>
            تم العثور على{" "}
            <span className="en-code">border-bottom-right-radius</span> مادي. استخدم{" "}
            <span className="en-code">border-end-end-radius</span>.
          </>
        ),
        text: "تم العثور على border-bottom-right-radius مادي. استخدم border-end-end-radius."
      },
      FIX_BORDER_BOTTOM_LEFT_RADIUS: {
        ui: (
          <>
            تم العثور على <span className="en-code">border-bottom-left-radius</span>{" "}
            مادي. استخدم <span className="en-code">border-end-start-radius</span>.
          </>
        ),
        text: "تم العثور على border-bottom-left-radius مادي. استخدم border-end-start-radius."
      },
      FIX_BORDER_RADIUS_SHORTHAND: {
        ui: (
          <>
            تم العثور على اختصار <span className="en-code">border-radius</span>{" "}
            مادي. استخدم الخصائص المنطقية.
          </>
        ),
        text: "تم العثور على اختصار border-radius مادي. استخدم الخصائص المنطقية."
      },
      FIX_LEFT_POSITION: {
        ui: (
          <>
            تم العثور على تموضع <span className="en-code">left</span>. استخدم{" "}
            <span className="en-code">inset-inline-start</span>.
          </>
        ),
        text: "تم العثور على تموضع left. استخدم inset-inline-start."
      },
      FIX_RIGHT_POSITION: {
        ui: (
          <>
            تم العثور على تموضع <span className="en-code">right</span>. استخدم{" "}
            <span className="en-code">inset-inline-end</span>.
          </>
        ),
        text: "تم العثور على تموضع right. استخدم inset-inline-end."
      }
    },

    // New Blog Specific Labels
    blogSubtitle:
      "دليلك الشامل لتحسين تجربة المستخدم، دعم العربية، وسهولة الوصول.",
    blogFixLabel: "💡 الحل:",
    videoWatch: "شاهد الشرح:",

    // The Blog Data
    blogPosts: [
      {
        id: 1,
        title: "1. الهيكلية والدلالات (HTML Semantics)",
        desc: "استخدام وسوم <div> العامة لكل شيء يجعل موقعك صندوقاً أسود لقارئات الشاشة. تعتمد أدوات المساعدة على المعالم للتنقل.",
        fix: "استبدل الـ divs العامة بوسوم HTML5 القياسية.",
        code: CODE_SNIPPETS.structure,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=vAAzdi1xuUY",
        videoTitle: "لماذا الهيكلية والدلالات مهمة",
      },
      {
        id: 2,
        title: "2. الصور والنص البديل (Alt Text)",
        desc: "عندما تفتقد الصورة لوسم alt، تقرأ قارئات الشاشة اسم الملف، وهو أمر مزعج. محركات البحث أيضاً لا تستطيع 'رؤية' الصور.",
        fix: "أضف دائماً وصفاً للصورة. إذا كانت الصورة للزينة فقط، اترك الوصف فارغاً.",
        code: CODE_SNIPPETS.images,
        language: "html",
        videoUrl: "https://youtu.be/JP2VkfYF5HU?si=-ZD5xE142ZG8ClGn&t=166",
        videoTitle: "لماذا يجب عليك البدء في استخدام سمات ARIA في HTML",
      },
      {
        id: 3,
        title: "3. الخصائص المنطقية (Logical Properties)",
        desc: "استخدام اليمين واليسار (Physical) يكسر التصميم عند تحويل الموقع للعربية لأن الهوامش لا تنقلب.",
        fix: "نستخدم 'البداية' (Start) و 'النهاية' (End). المتصفح سيقوم بقلبها تلقائياً.",
        code: CODE_SNIPPETS.logicalProperties,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=wPvXHiHHSgY",
        videoTitle: "كل ما تحتاج إلى معرفته حول خصائص CSS المنطقية",
      },
      {
        id: 4,
        title: "4. الوحدات النسبية (Rem vs Px)",
        desc: "وحدات البكسل ثابتة. إذا قام المستخدم بتكبير حجم الخط، النصوص المكتوبة بالـ px لن تتغير.",
        fix: "استخدم rem. حيث 1rem يساوي حجم خط المتصفح الافتراضي ويتغير بتغير الإعدادات.",
        code: CODE_SNIPPETS.remUnits,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=okw-whFWGEo",
        videoTitle:
          "توقف عن استخدام البكسلات في CSS! كيف ولماذا تستخدم REM وEM؟",
      },
      {
        id: 5,
        title: "5. سمات اللغة والاتجاه (Lang & Dir)",
        desc: "بدون سمة اللغة (lang)، ستقرأ قارئات الشاشة النص العربي بلهجة إنجليزية (غير مفهوم). وبدون سمة الاتجاه (dir)، سيفترض المتصفح تخطيطاً من اليسار لليمين.",
        fix: "أضف دائماً سمات اللغة والاتجاه في وسم HTML الرئيسي.",
        code: CODE_SNIPPETS.langDir,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=cOmehxAU_4s",
        videoTitle: "كيف أقوم بإجراء فحص إمكانية الوصول",
      },
      {
        id: 6,
        title: "6. وسوم الميتا (Meta Tags)",
        desc: "وسوم الميتا غير مرئية للمستخدمين ولكنها حاسمة للمتصفحات. غياب وسم 'viewport' يجعل موقعك يبدو صغيراً جداً على الهواتف. وغياب 'description' يضر بظهورك في جوجل.",
        fix: "أضف وسوم الميتا القياسية في الـ <head>.",
        code: CODE_SNIPPETS.metaTags,
        language: "html",
        videoUrl: "https://www.youtube.com/watch?v=WecWWZifXB4",
        videoTitle: "تعلم علامات HTML التعريفية في 4 دقائق!",
      },
      {
        id: 7,
        title: "7. محاذاة النصوص (Text Align)",
        desc: "إجبار النص على 'text-align: left' في الفقرات العربية يجعل القراءة صعبة وشكل النص غير متناسق.",
        fix: "تجنب استخدام 'left' أو 'right'. استخدم 'start' و 'end' ليقوم المتصفح بتحديد الجهة حسب اللغة.",
        code: CODE_SNIPPETS.textAlign,
        language: "css",
        videoUrl: "https://www.youtube.com/watch?v=wPvXHiHHSgY",
        videoTitle: "كل ما تحتاج إلى معرفته حول خصائص CSS المنطقية",
      },
      {
        id: 8,
        title: "8. التعامل مع تعارض المتغيرات",
        desc: "ماذا لو كنت تستخدم بالفعل متغيراً باسم 'text' أو 'data'؟ أداتنا تقوم بتسميته تلقائياً، ولكن يمكنك تغيير الاسم يدوياً.",
        fix: "استخدم التفكيك مع اسم جديد: const { text: myCustomName } = useContext(LanguageContext);",
        code: `// إذا كان لديك: const text = "نص محلي";
// ستقوم الأداة بحقن التالي:
const { text: arabifyContextvalue } = useContext(LanguageContext);

// يمكنك تغييره يدوياً إلى:
const { text: appText } = useContext(LanguageContext);
// الآن استخدم {appText.welcome} في الكود الخاص بك.`,
        language: "javascript",
        videoUrl: "",
        videoTitle: "توثيق: تخصيص الحقن",
      },
    ],
  },
};
