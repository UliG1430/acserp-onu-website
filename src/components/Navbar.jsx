import React, { useState } from 'react';
import NavLink from './NavLink'; // Importamos nuestro NavLink personalizado

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "ACSERP", path: "/acserp" },
    { name: "Órganos", path: "/organos" },
    { name: "Recursos", path: "https://drive.google.com/drive/folders/1I3VcyWMO3rW2JoXUAf0-Gf9PIl-I0xMl", target: "_blank" },
    { name: "Fotos", path: "/fotos" },
    { name: "Redes", path: "/redes" },
    { name: "Donaciones", path: "/donaciones" },
    {
      name: "Sumate",
      path: "https://docs.google.com/forms/d/e/1FAIpQLSddWUwMLDS6Z_-hGnxv65SQspFh21f90LH-as_23oMTZeUX4Q/viewform",
      target: "_blank",
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-[#121445] shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Botón hamburguesa para móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-blue-950 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-950 focus:outline-none transition duration-300 ease-in-out"
              aria-label="Abrir menú de navegación"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "rotate-45 translate-y-2" : "-translate-y-2"}`} />
                <span className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "opacity-0" : ""}`} />
                <span className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${isOpen ? "-rotate-45 -translate-y-2" : "translate-y-2"}`} />
              </div>
            </button>
          </div>

          {/* Links para pantallas grandes */}
          <div className="hidden md:flex space-x-8 justify-center w-full ml-10 navbar-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                label={link.name}
                target={link.target}
                className={`flex items-center ${
                  link.name === "Sumate"
                    ? "px-3 py-1 border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-950 transition duration-300"
                    : "text-white hover:text-gray-300 transition duration-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Menú desplegable para móvil con animación */}
      <div className={`${isOpen ? "max-h-screen scale-100" : "max-h-0 scale-95"} transition-all duration-500 ease-in-out overflow-hidden md:hidden bg-blue-950 bg-opacity-95`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              label={link.name}
              target={link.target}
              mobile
              onClick={() => setIsOpen(false)}
              className={`flex items-center ${
                link.name === "Sumate"
                  ? "block px-4 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-950 transition duration-300"
                  : "block text-white hover:text-gray-300 transition duration-300"
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
