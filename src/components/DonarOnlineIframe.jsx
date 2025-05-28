import React from "react";

const DonarOnlineIframe = () => {
  return (
    <section className="bg-blue-950 py-16 px-4 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Suscribite con Donar Online</h2>
        <p className="text-lg mb-8">
          Apoyá mensualmente al Modelo ONU La Plata y ayudá a construir una educación pública y transformadora.
        </p>
        <div className="w-full overflow-hidden rounded-lg shadow-lg max-w-2xl mx-auto">
          <iframe
            id="donaronline-iframe"
            src="https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita/widget"
            width="100%"
            height="800"
            frameBorder="0"
            scrolling="no"
            title="Formulario de donación DonarOnline"
            className="rounded-md border-0 w-full h-[800px]"
          />
        </div>
      </div>
    </section>
  );
};

export default DonarOnlineIframe;
