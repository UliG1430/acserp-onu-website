import React, { useState, useEffect } from "react";
import App from "./App";
import SplashScreen from "./components/SplashScreen";
import { HelmetProvider } from "react-helmet-async";

const Root = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <HelmetProvider>
      <SplashScreen show={showSplash} />
      {!showSplash && <App />}
    </HelmetProvider>
  );
};

export default Root;