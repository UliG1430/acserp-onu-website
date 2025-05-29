// src/components/DonarOnlineWidget.jsx
import React, { useEffect } from "react";

const DonarOnlineWidget = ({ slug, color = "#ffffff" }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://donaronline.org/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="donaronline-widget"
      data-slug={slug}
      data-color={color}
    ></div>
  );
};

export default DonarOnlineWidget;
