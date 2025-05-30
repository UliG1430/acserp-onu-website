import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faYoutube,
  faLinkedin,
  faTiktok,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121445] text-white py-6">
      <div className="container mx-auto flex justify-center space-x-6">
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-blue-700"
        >
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-blue-700 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
          </span>
        </a>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@modeloonulp "
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-black"
        >
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faTiktok} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-black transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faTiktok} className="h-6 w-6" />
          </span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/modeloonulp/?hl=es"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-pink-500"
        >
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-pink-500 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
          </span>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@modeloonulaplata"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-red-500"
        >
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-red-500 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
          </span>
        </a>
      </div>

      <div className="text-center mt-4">
        <p>© {currentYear} Asociación Civil Simulacros Educativos Río de la Plata</p>
        <p className="text-sm mt-2 flex justify-center items-center">
          Desarrollado por
          <a
            href="https://github.com/UliG1430"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-400 hover:text-blue-500 cursor-pointer ml-1 flex items-center group"
          >
            <span className="transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-105">
              Ulises Geymonat
            </span>
            <FontAwesomeIcon
              icon={faGithub}
              className="ml-2 text-xl transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-105"
            />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
