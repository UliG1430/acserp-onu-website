import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="container mx-auto flex justify-center space-x-6">
        {/* Facebook */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon si-facebook group">
          <span className="icon">
            <FontAwesomeIcon icon={faFacebookF} className="text-white" />
          </span>
          <span className="icon-active">
            <FontAwesomeIcon icon={faFacebookF} className="text-blue-500" />
          </span>
        </a>

        {/* Twitter */}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon si-twitter group">
          <span className="icon">
            <FontAwesomeIcon icon={faTwitter} className="text-white" />
          </span>
          <span className="icon-active">
            <FontAwesomeIcon icon={faTwitter} className="text-blue-400" />
          </span>
        </a>

        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon si-instagram group">
          <span className="icon">
            <FontAwesomeIcon icon={faInstagram} className="text-white" />
          </span>
          <span className="icon-active">
            <FontAwesomeIcon icon={faInstagram} className="text-pink-500" />
          </span>
        </a>

        {/* YouTube */}
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon si-youtube group">
          <span className="icon">
            <FontAwesomeIcon icon={faYoutube} className="text-white" />
          </span>
          <span className="icon-active">
            <FontAwesomeIcon icon={faYoutube} className="text-red-500" />
          </span>
        </a>
      </div>
      <div className="text-center mt-4">
        <p>© 2024 Asociacionismo Civil Simulacros Educativos Río de la Plata</p>
      </div>
    </footer>
  );
}

export default Footer;
