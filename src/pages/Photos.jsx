import React from 'react';
import image1 from '../assets/images/image1.JPG';
import image2 from '../assets/images/image2.JPG';
import image3 from '../assets/images/image3.JPG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons'; // Importamos el ícono de FontAwesome

const Photos = () => {
  const googleDriveLink = "https://drive.google.com/embeddedfolderview?id=1xE8paosqx8vOquGbAuYX9st3GLtAX_8T#grid";
  const googleDriveGeneralLink = "https://drive.google.com/drive/folders/1F8iVK5Op6QFQ0tjg254wJaTsOadnszxc";

  // Array de imágenes
  const images = [
    { src: image1, alt: "Foto 1" },
    { src: image2, alt: "Foto 2" },
    { src: image3, alt: "Foto 3" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Encabezado de la sección */}
      <div className="text-center py-12 bg-indigo-950">
        <h1 className="text-white text-4xl font-bold">Galería de Fotos</h1>
        <p className="text-indigo-300 text-lg mt-2">Momentos destacados de nuestros simulacros educativos</p>
      </div>

      {/* Sección de galería con fondo violeta */}
      <div className="w-full px-4 py-12 bg-[#61629b]">
        <div className="max-w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto px-4 lg:px-32">
          {images.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Google Drive */}
      <div className="w-full px-4 py-12 text-center">
        <h2 className="text-blue-950 text-3xl font-bold mb-6 flex flex-row justify-center items-center rotate-on-hover">
          <FontAwesomeIcon
            icon={faGoogleDrive}
            className="mr-3 text-blue-600 fa-google-drive" 
            style={{ fontSize: '32px' }} 
          />
          Fotos VI Edición del Modelo Público Más Grande del País
        </h2>

        <div className="bg-[#e0e0f8] rounded-lg shadow-lg p-4 mb-4">
          <iframe
            src={googleDriveLink}
            title="Google Drive Photos"
            width="100%"
            height="300"
            className="rounded-lg"
            frameBorder="0"
          />
        </div>

        <a
          href={googleDriveGeneralLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl rotate-on-hover"
        >
          <FontAwesomeIcon icon={faGoogleDrive} className="mr-2 fa-google-drive" style={{ fontSize: '24px' }} />
          Acceder a la galería completa
        </a>
      </div>
    </div>
  );
};

export default Photos;
