import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Scroll instantly or smoothly to top when route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth", // or "auto" if you want it instant
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
