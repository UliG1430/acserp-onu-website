import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { driveConfig } from '../config/driveConfig';

// Importar logos
import libertyTimesLogo from '../assets/logos/liberty_times.png';
import onuTodayLogo from '../assets/logos/onu_today.png';
import voceroDelSurLogo from '../assets/logos/vocero_del_sur_png.png';

const DrivePreviewSimple = () => {
  const driveUrl = `https://drive.google.com/drive/folders/${driveConfig.mainFolderId}`;
  const newspapers = driveConfig.newspapers;

  // Mapeo de logos
  const logoMap = {
    'Liberty Times': libertyTimesLogo,
    'ONU Today': onuTodayLogo,
    'Vocero del Sur': voceroDelSurLogo
  };

  return (
    <section data-section="diarios" className="py-16 bg-gradient-to-br from-indigo-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Diarios del Modelo ONU</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Accedé a las publicaciones más importantes del período de sesiones
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
      {/* Grid de diarios con diseño moderno */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">
        {newspapers.map((newspaper, index) => (
          <motion.div
            key={newspaper.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
          >
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{backgroundColor: newspaper.color}}></div>
            
            {/* Portada con logo */}
            <div className="h-64 flex items-center justify-center relative overflow-hidden" style={{backgroundColor: newspaper.color}}>
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <img 
                src={logoMap[newspaper.name]} 
                alt={`Logo de ${newspaper.name}`}
                className={`object-contain relative z-10 filter drop-shadow-xl ${
                  newspaper.name === 'Liberty Times' || newspaper.name === 'Vocero del Sur' 
                    ? 'w-56 h-56' 
                    : 'w-48 h-48'
                }`}
              />
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
            </div>

            {/* Contenido */}
            <div className="relative p-8 min-h-[300px] flex flex-col">
              {/* Título */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight mb-2">
                  {newspaper.name}
                </h3>
                <p className="text-base text-gray-500 font-medium">
                  {newspaper.name === 'ONU Today' ? 'Noticiero' : 'Publicación Digital'}
                </p>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 text-base mb-8 leading-relaxed flex-1">
                {newspaper.description}
              </p>

              {/* Botón de acción */}
              <a
                href={newspaper.folderId}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{backgroundColor: newspaper.color}}
              >
                <div className="flex items-center justify-center gap-3">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-lg" />
                  <span>Acceder</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-sm" />
                </div>
              </a>
            </div>

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
          </motion.div>
        ))}
      </div>

    
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrivePreviewSimple;
