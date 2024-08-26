import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-900">
      <ul className="flex justify-center space-x-6 py-2">
        <li><a href="#" className="text-white hover:text-gray-400">Inicio</a></li>
        <li><a href="#" className="text-white hover:text-gray-400">ACSERP</a></li>
        <li><a href="#" className="text-white hover:text-gray-400">Modelo</a></li>
        <li><a href="#" className="text-white hover:text-gray-400">Recursos</a></li>
        <li><a href="#" className="text-white hover:text-gray-400">Fotos</a></li>
        <li><a href="#" className="text-white hover:text-gray-400">Redes</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
