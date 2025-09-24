import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTimes, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const DiariosNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Verificar si la notificación ya fue cerrada en esta sesión
    const hasSeenNotification = sessionStorage.getItem('diariosNotificationSeen');
    if (!hasSeenNotification) {
      // Mostrar la notificación después de 1 segundo
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('diariosNotificationSeen', 'true');
    }, 300);
  };

  const handleScrollToDiarios = () => {
    const diariosSection = document.querySelector('[data-section="diarios"]');
    if (diariosSection) {
      diariosSection.scrollIntoView({ behavior: 'smooth' });
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ 
            opacity: isClosing ? 0 : 1, 
            x: isClosing ? 100 : 0,
            scale: isClosing ? 0.8 : 1
          }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Icono */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faNewspaper} className="text-white text-xl" />
              </div>
              
              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  📰 ¡Ya están disponibles!
                </h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Las noticias de los diarios del Modelo ONU ya están listas para descargar
                </p>
                
                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={handleScrollToDiarios}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faArrowDown} className="text-sm" />
                    Ver Diarios
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-sm text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiariosNotification;
