import React from 'react';
import logo from '../assets/images/Azul Viejo - Logo ACSERP + Texto.png';
import Navbar from './Navbar';

const Header = () => {
  return (
    <a href="./">
      <header className="">
        <div className="container mx-auto flex justify-center items-center py-4 border-b border-gray-300">
          <img src={logo} alt="Simulacros Educativos Rio de la Plata" className="h-16" />
        </div>
      </header>
    </a>
  );
}

export default Header;
