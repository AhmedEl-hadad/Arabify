import "./App.css";
import { useState, useEffect } from "react";
import { content } from "./content.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Import Pages
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";

function App() {
  // Initialize state (check localStorage so it remembers the choice on refresh)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("appLanguage") || "en";
  });

  // Update the HTML tag whenever 'lang' changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Save to localStorage
    localStorage.setItem("appLanguage", lang);
  }, [lang]);

  // Toggle Function
  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  // Helper to get current text
  const text = content[lang];

  return (
    <div className="App">
      <Router>
        {/* 4. PASS THE FUNCTION DOWN AS A PROP */}
        <ScrollToTop />
        <Header
          text={text}
          toggleLanguage={toggleLanguage} /* <--- Here is the connection */
        />

        <Routes>
          <Route path="/" element={<Home text={text} lang={lang} />} />
          <Route path="/blog" element={<Blog text={text} />} />
        </Routes>

        <Footer text={text} />
      </Router>
    </div>
  );
}

export default App;
