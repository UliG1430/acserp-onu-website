import React from "react";

const DonarOnlineIframe = () => {
  return (
    <section className="bg-blue-950 py-16 px-4 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Formulario de Donación</h2>
        <p className="text-lg mb-8">
          Completá los pasos y elegí tu monto para apoyar al Modelo ONU La Plata.
        </p>

        <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src="https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita"
            title="DonarOnline Formulario"
            width="100%"
            height="820"
            frameBorder="0"
            scrolling="no"
            className="w-full h-[820px] border-0"
            allowTransparency="true"
          />
        </div>
      </div>
    </section>
  );
};

export default DonarOnlineIframe;
