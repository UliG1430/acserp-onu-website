import React from 'react';
import { Link } from 'react-router-dom';
import { isSafeExternalUrl } from '../utils/contentSecurity';

const NavLink = ({ to, label, mobile, onClick, className }) => {
  // Detectamos si el enlace es externo (comienza con http)
  const destination = String(to || '');
  const isExternal = /^https?:\/\//i.test(destination);

  if (!isExternal && !destination.startsWith('/')) {
    return <span className={`${className} cursor-not-allowed opacity-60`}>{label}</span>;
  }

  if (isExternal) {
    if (!isSafeExternalUrl(destination)) return <span className={`${className} cursor-not-allowed opacity-60`}>{label}</span>;
    return (
      <a
        href={destination}
        className={`${className} text-white hover:transition duration-300 ease-in-out transform hover:scale-110 hover:translate-y-1 ${
          mobile ? 'block px-3 py-2 rounded-md text-base font-medium' : ''
        }`}
        target="_blank" 
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={destination}
      className={`${className} text-white hover:transition duration-300 ease-in-out transform hover:scale-110 hover:translate-y-1 ${
        mobile ? 'block px-3 py-2 rounded-md text-base font-medium' : ''
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavLink;
