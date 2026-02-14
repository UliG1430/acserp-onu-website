import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Importar componente React de FontAwesome
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';  // Importar los íconos que necesitas

export const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/55 p-4 md:p-3 rounded-full cursor-pointer z-10 touch-manipulation"
      onClick={onClick}
      aria-label="Siguiente noticia"
      role="button"
    >
      <FontAwesomeIcon icon={faChevronRight} className="text-white text-2xl" />
    </div>
  );
};

export const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/55 p-4 md:p-3 rounded-full cursor-pointer z-10 touch-manipulation"
      onClick={onClick}
      aria-label="Noticia anterior"
      role="button"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-white text-2xl" />
    </div>
  );
};
