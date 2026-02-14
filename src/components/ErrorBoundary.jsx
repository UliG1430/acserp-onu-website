import React from "react";
import { shouldUseSafeMode } from "../utils/runtimeSafety";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ACSERP runtime error:", error, info);

    if (typeof window === "undefined") return;

    const isSafeModeUrl = new URLSearchParams(window.location.search).get("safeMode") === "1";
    const alreadyRetried = sessionStorage.getItem("acserp-safe-retry") === "1";

    if (shouldUseSafeMode() && !isSafeModeUrl && !alreadyRetried) {
      sessionStorage.setItem("acserp-safe-retry", "1");
      window.location.assign("/?safeMode=1");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-blue-950 text-white px-6 text-center">
          <p className="text-base md:text-lg">
            Hubo un problema al cargar la p&aacute;gina. Prob&aacute; abrir el enlace en Chrome o Safari.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
