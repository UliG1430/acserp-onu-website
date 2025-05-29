import React, { useEffect } from "react";

const DonarOnlineWidget = () => {
  useEffect(() => {
    const scriptId = "donaronline-widget-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://donaronline.org/widget.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      if (window.DonarOnlineWidget?.init) {
        window.DonarOnlineWidget.init();
      }
    }
  }, []);

  return (
    <section className="bg-blue-950 py-16 px-4 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Suscribite con Donar Online</h2>
        <p className="text-lg mb-8">
          Apoyá mensualmente al Modelo ONU La Plata y ayudá a construir una educación pública y transformadora.
        </p>
        <div className="flex justify-center">
          <div
            className="donaronline-widget w-full max-w-xl min-h-[400px]"
            data-slug="simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita"
            data-color="#ffffff"
          />
        </div>
      </div>
    </section>
  );
};

export default DonarOnlineWidget;
