import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const SubscriptionCallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-blue-950 to-indigo-800 text-white py-16 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-full">
          <FontAwesomeIcon icon={faHeart} className="text-red-400 text-5xl animate-bounce-slow" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Sumate al impulso que transforma.
        </h2>
        <p className="text-lg md:text-xl max-w-3xl text-blue-100 leading-relaxed">
          Con tu aporte mensual, acompañás al Modelo ONU público más grande del país en su misión de llevar educación transformadora a miles de estudiantes cada año.
        </p>
        <a
          href="https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-950 font-semibold text-lg px-8 py-3 rounded-full shadow-md hover:scale-105 hover:bg-blue-100 transition-transform duration-300"
        >
          Quiero apoyar mensualmente
        </a>
      </div>
    </section>
  );
};

export default SubscriptionCallToAction;
