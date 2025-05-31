import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import SEOHelmet from "../components/SEOHelmet";
import recursoBanner from "../assets/images/image1.JPG";
import PreliminaryDraftPanel from "../components/PreliminaryDraftPanel";
import SlideOverTrigger from "../components/SlideOverTrigger";

const Recursos = () => {
  const { ref: driveRef, inView: driveInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [isPanelOpen, setPanelOpen] = useState(false);

  const driveLink = "https://drive.google.com/drive/folders/1PC0-MdHZ-Um-r8OEf-vQJ4TwqmwUchUw";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <SEOHelmet 
        title="Recursos - Modelo ONU La Plata" 
        description="Accedé a los recursos y materiales educativos del Modelo ONU La Plata para delegados, docentes y organizadores."
        url="https://acserp.org.ar/recursos"
        image="https://acserp.org.ar/og-image.png"
      />

      {/* Hero */}
      <div className="relative w-full h-[400px] shadow-md">
        <img 
          src={recursoBanner} 
          alt="Recursos Modelo ONU" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              Recursos Académicos
            </h1>
            <p className="text-lg md:text-xl font-semibold text-[#a0c4ff] drop-shadow-md tracking-wide max-w-2xl mx-auto mt-4">
              Guías, documentos, reglamentos y materiales clave para vivir la experiencia Modelo ONU.
            </p>
          </div>
        </div>
      </div>

      {/* Intro Text Full Width */}
      <section className="bg-blue-950 py-16 w-full">
        <div className="w-full text-center text-white">
          <p className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm max-w-7xl mx-auto px-4">
            En este espacio vas a encontrar todos los documentos necesarios para participar del Modelo de Naciones Unidas. Desde el reglamento oficial hasta las guías de comité y recursos para docentes.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section
        ref={driveRef}
        className={`transition-opacity duration-1000 ease-in-out px-6 py-20 w-full ${
          driveInView ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">

          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faGoogleDrive} className="text-[#4285F4] text-4xl mb-4" />
            <h3 className="text-lg font-bold mb-2 text-blue-900">Carpeta Drive oficial</h3>
            <p className="text-sm text-gray-600 mb-4">Accedé a todos los materiales del Modelo ONU.</p>
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
            >
              Ver documentos
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faFileAlt} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-lg font-bold mb-2 text-blue-900">Reglamento Modelo ONU</h3>
            <p className="text-sm text-gray-600 mb-4">Descargá el reglamento oficial con toda la normativa y protocolos.</p>
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
            >
              Descargar reglamento
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faFolderOpen} className="text-blue-400 text-4xl mb-4" />
            <h3 className="text-lg font-bold mb-2 text-blue-900">Guías de comité</h3>
            <p className="text-sm text-gray-600 mb-4">Consultá las guías específicas para cada comité temático.</p>
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
            >
              Ver guías
            </a>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-start justify-between">
            <FontAwesomeIcon icon={faFolderOpen} className="text-pink-500 text-4xl mb-4" />
            <h3 className="text-lg font-bold mb-2 text-blue-900">Anteproyectos</h3>
            <p className="text-sm text-gray-600 mb-4">Explorá los anteproyectos de cada órgano y descargalos directamente.</p>
            <SlideOverTrigger />
          </div>

        </div>
      </section>
    </div>
  );
};

export default Recursos;
