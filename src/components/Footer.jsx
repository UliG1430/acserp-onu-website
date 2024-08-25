import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4">
      <div className="container mx-auto flex flex-col items-center">
        <p>&copy; {new Date().getFullYear()} Simulacros Educativos. Todos los derechos reservados.</p>
        <div className="mt-4 flex space-x-6">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="path/to/icon-instagram.png" alt="Instagram" className="w-6 h-6"/>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="path/to/icon-instagram.png" alt="Facebook" className="w-6 h-6"/>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="path/to/icon-instagram.png" alt="Twitter" className="w-6 h-6"/>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
