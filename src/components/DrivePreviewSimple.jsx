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
      {/* Grid de burbujas modernas */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
        {newspapers.map((newspaper, index) => (
          <motion.div
            key={newspaper.name}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative"
          >
            {/* Burbuja principal */}
            <div 
              className="relative w-80 h-80 mx-auto rounded-full shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out transform hover:scale-105 cursor-pointer overflow-hidden"
              style={{backgroundColor: newspaper.color}}
            >
              {/* Efecto de gradiente interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              {/* Logo centrado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={logoMap[newspaper.name]} 
                  alt={`Logo de ${newspaper.name}`}
                  className={`object-contain filter drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110 ${
                    newspaper.name === 'Liberty Times' || newspaper.name === 'Vocero del Sur' 
                      ? 'w-48 h-48' 
                      : 'w-40 h-40'
                  }`}
                />
              </div>

              {/* Efecto de ondas */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-all duration-[2000ms] ease-out"></div>
              </div>

              {/* Enlace invisible para acceder */}
              <a
                href={newspaper.folderId}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label={`Acceder a ${newspaper.name}`}
              ></a>
            </div>
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
