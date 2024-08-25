import React from 'react';

function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        <img src="path/to/logo.png" alt="Logo" className="w-10 h-10"/>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="hover:text-gray-300 transition-all">Inicio</a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-300 transition-all">Acerca de</a>
          </li>
          <li>
            <a href="/contact" className="hover:text-gray-300 transition-all">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
