import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white py-6">
      <div className="container mx-auto flex justify-center space-x-6">
        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-blue-500">
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faFacebookF} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-blue-500 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faFacebookF} className="h-6 w-6" />
          </span>
        </a>

        {/* Twitter */}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-blue-400">
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-blue-400 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
          </span>
        </a>

        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-pink-500">
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-pink-500 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
          </span>
        </a>

        {/* YouTube */}
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon group relative flex items-center justify-center w-12 h-12 border-2 border-white rounded-full overflow-hidden transition duration-300 ease-in-out hover:bg-red-500">
          <span className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
            <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-red-500 transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 group-hover:text-white">
            <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
          </span>
        </a>
      </div>
      <div className="text-center mt-4">
        <p>© {currentYear} Asociacion Civil Simulacros Educativos Río de la Plata</p>
      </div>
    </footer>
  );
}

export default Footer;
