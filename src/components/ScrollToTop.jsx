// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/pixel";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
