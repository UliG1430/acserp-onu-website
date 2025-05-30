import React from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";

import SEOHelmet from '../components/SEOHelmet';
import recursoBanner from '../assets/images/image1.JPG';

const Recursos = () => {
  const { ref: driveRef, inView: driveInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const driveLink = "https://drive.google.com/drive/folders/1PC0-MdHZ-Um-r8OEf-vQJ4TwqmwUchUw";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <SEOHelmet 
        title="Recursos - Modelo ONU La Plata" 
        description="Accedé a los recursos y materiales educativos del Modelo ONU La Plata para delegados, docentes y organizadores."
        url="https://acserp.org.ar/recursos"
        image="https://acserp.org.ar/og-image.png"
      />

      {/* Hero con imagen y overlay */}
      <div className="relative w-full h-[400px] shadow-md">
        <img 
          src={recursoBanner} 
          alt="Recursos Modelo ONU" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">Recursos Académicos</h1>
            <p className="text-lg md:text-xl text-indigo-100 font-medium max-w-2xl mx-auto drop-shadow-sm">
              Guías, documentos, reglamentos y materiales clave para vivir la experiencia Modelo ONU.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <section ref={driveRef} className={`transition-opacity duration-1000 ease-in-out px-6 py-20 max-w-5xl mx-auto ${driveInView ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-lg text-gray-800 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          En este espacio vas a encontrar todos los documentos necesarios para participar del Modelo de Naciones Unidas. Desde el reglamento oficial hasta las guías de comité y recursos para docentes.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {/* CARD 1 */}
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

          {/* CARD 2 */}
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

          {/* CARD 3 */}
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
        </div>
      </section>
    </div>
  );
};

export default Recursos;