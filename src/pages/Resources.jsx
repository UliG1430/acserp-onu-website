import React from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import SEOHelmet from '../components/SEOHelmet';
import recursoBanner from '../assets/images/image1.jpg';

const Recursos = () => {
  const { ref: driveRef, inView: driveInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const driveLink = "https://drive.google.com/drive/folders/1PC0-MdHZ-Um-r8OEf-vQJ4TwqmwUchUw";

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet 
        title="Recursos - Modelo ONU La Plata" 
        description="Accedé a los recursos y materiales educativos del Modelo ONU La Plata para delegados, docentes y organizadores."
        url="https://acserp.org.ar/recursos"
        image="https://acserp.org.ar/og-image.png"
      />

      {/* Hero con imagen y overlay */}
      <div className="relative w-full h-[400px]">
        <img 
          src={recursoBanner} 
          alt="Recursos Modelo ONU" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Recursos Académicos</h1>
            <p className="text-lg md:text-xl text-indigo-100">Guías, documentos, reglamentos y materiales clave para vivir la experiencia Modelo ONU</p>
          </div>
        </div>
      </div>

      {/* Botón de acceso */}
      <div ref={driveRef} className={`w-full px-4 py-16 text-center transition-opacity duration-1000 ${driveInView ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          En este espacio vas a encontrar todos los documentos necesarios para participar del Modelo de Naciones Unidas. Desde el reglamento oficial hasta las guías de comité y recursos para docentes.
        </p>

        <a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl rotate-on-hover"
        >
          <FontAwesomeIcon icon={faGoogleDrive} className="mr-2 fa-google-drive" style={{ fontSize: '24px' }} />
          Acceder a recursos
        </a>
      </div>
    </div>
  );
};

export default Recursos;
