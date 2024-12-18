import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, label, mobile, onClick }) => {
  // Detectamos si el enlace es externo (comienza con http)
  const isExternal = to.startsWith('http');

  if (isExternal) {
    return (
      <a
        href={to}
        className={`text-white hover:transition duration-300 ease-in-out transform hover:scale-110 hover:translate-y-1 ${
          mobile ? 'block px-3 py-2 rounded-md text-base font-medium' : ''
        }`}
        target="_blank" // Abrir en nueva pestaña
        rel="noopener noreferrer" // Buena práctica para enlaces externos
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`text-white hover:transition duration-300 ease-in-out transform hover:scale-110 hover:translate-y-1 ${
        mobile ? 'block px-3 py-2 rounded-md text-base font-medium' : ''
      }`}
      onClick={onClick} // Usamos onClick para cerrar el menú móvil si es necesario
    >
      {label}
    </Link>
  );
};

export default NavLink;
