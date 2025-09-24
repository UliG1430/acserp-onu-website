import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faNewspaper, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const NewsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el popup ya fue cerrado en esta sesión
    const hasSeenPopup = sessionStorage.getItem('newsPopupSeen');
    if (!hasSeenPopup) {
      // Mostrar el popup después de 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('newsPopupSeen', 'true');
    }, 300);
  };

  const handleGoToHome = () => {
    handleClose();
    // Scroll to the diarios section on the same page
    setTimeout(() => {
      const diariosSection = document.querySelector('[data-section="diarios"]');
      if (diariosSection) {
        diariosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: isClosing ? 0.8 : 1, 
              opacity: isClosing ? 0 : 1, 
              y: isClosing ? 50 : 0 
            }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>

            {/* Contenido del popup */}
            <div className="text-center">
              {/* Icono */}
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <FontAwesomeIcon icon={faNewspaper} className="text-white text-2xl" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                📰 Diarios de la ONU
              </h3>

              {/* Mensaje */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Accedé a los diarios más importantes del período de sesiones de las Naciones Unidas Septiembre 2025.
              </p>

              {/* Botones */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToHome}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  Ver Diarios
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full text-gray-500 py-2 px-6 rounded-lg font-medium hover:text-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Efecto de burbuja flotante */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsPopup;
