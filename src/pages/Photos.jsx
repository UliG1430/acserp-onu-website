import React from 'react';
import image1 from '../assets/images/image1.JPG';
import image2 from '../assets/images/image2.JPG';
import image3 from '../assets/images/image3.JPG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons'; // Importamos el ícono de FontAwesome

const Photos = () => {
  const googleDriveLink = "https://drive.google.com/embeddedfolderview?id=1xE8paosqx8vOquGbAuYX9st3GLtAX_8T#grid";

  // Array de imágenes
  const images = [
    { src: image1, alt: "Foto 1" },
    { src: image2, alt: "Foto 2" },
    { src: image3, alt: "Foto 3" },
  ];

  return (
    <div className="min-h-screen"> {/* Fondo blanco general */}
      {/* Encabezado de la sección */}
      <div className="text-center py-12 bg-indigo-950">
        <h1 className="text-white text-4xl font-bold">Fotos VI Edición del Modelo Público Más Grande del País</h1>
        <p className="text-white text-lg mt-4">Disfruta de las fotos de nuestros eventos y actividades</p>
      </div>

      {/* Sección de galería con fondo violeta */}
      <div className="w-full px-4 py-12 bg-[#61629b]"> {/* Fondo violeta para la galería */}
        <div className="max-w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto px-32">
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

      {/* Sección de preview desde Google Drive */}
      <div className="w-full px-4 py-12 text-center"> {/* Fondo blanco para esta sección */}
        <h2 className="text-blue-950 text-3xl font-bold mb-6 flex flex-row justify-center items-end">
          {/* Ícono de Google Drive antes del texto */}
          Mira todas las fotos en nuestra carpeta de
          <a className="flex flex-row ml-2 items-end justify-around underline underline-offset-auto text-blue-600 hover:text-indigo-300" href={googleDriveLink} target="_blank" rel="noopener noreferrer">
            Google Drive
            <svg className="h-10 w-fit ml-2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M17 6L31 6 45 30 31 30z"></path>
              <path fill="#1976D2" d="M9.875 42L16.938 30 45 30 38 42z"></path>
              <path fill="#4CAF50" d="M3 30.125L9.875 42 24 18 17 6z"></path>
            </svg>
          </a>
        </h2> 

        {/* Contenedor del iframe con color de fondo personalizado */}
        <div className="bg-[#e0e0f8] rounded-lg shadow-lg p-4 mb-4"> {/* Fondo lila claro */}
          <iframe
            src={googleDriveLink}
            title="Google Drive Photos"
            width="100%"
            height="300"
            className="rounded-lg"
            frameBorder="0"
          />
        </div>

        {/* Botón para acceder a la galería completa con nueva animación */}
        <a
          href={googleDriveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-[#787ac1] rounded-md transition duration-300 ease-in-out transform hover:bg-blue-950 hover:scale-105 hover:shadow-xl rotate-on-hover"
        >
          {/* Ícono de Google Drive dentro del botón */}
          <FontAwesomeIcon 
            icon={faGoogleDrive} 
            className="mr-2" // Aquí se aplicará la animación desde CSS
            style={{ fontSize: '24px' }} 
          />
          Acceder a la galería completa
        </a>
      </div>
    </div>
  );
};

export default Photos;
