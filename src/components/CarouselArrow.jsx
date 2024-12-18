import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Importar componente React de FontAwesome
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';  // Importar los íconos que necesitas

export const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} className="text-white text-2xl" />
    </div>
  );
};

export const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-white text-2xl" />
    </div>
  );
};
