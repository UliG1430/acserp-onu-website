import React from 'react';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';

const Photos = () => {
  const googleDriveLink = "https://drive.google.com/embeddedfolderview?id=1xE8paosqx8vOquGbAuYX9st3GLtAX_8T#grid";

  // Array de imágenes
  const images = [
    { src: image1, alt: "Foto 1" },
    { src: image2, alt: "Foto 2" },
    { src: image3, alt: "Foto 3" },
  ];

  return (
    <div className="bg-[#61629b] min-h-screen">
      {/* Encabezado de la sección */}
      <div className="text-center py-12">
        <h1 className="text-white text-4xl font-bold">Galería de Fotos</h1>
        <p className="text-white text-lg mt-4">Disfruta de las fotos de nuestros eventos y actividades</p>
      </div>

      {/* Sección de galería */}
      <div className="w-full px-4 py-12"> {/* Aseguramos que el contenedor use todo el ancho */}
        <div className="max-w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
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
      <div className="w-full px-4 py-12"> {/* Ajustar el ancho completo para evitar márgenes */}
      <h2 className="text-white text-3xl font-bold mb-6 text-center flex flex-row justify-center items-end">
          {/* Ícono de Google Drive antes del texto */}
          Mira todas las fotos en nuestra carpeta de
          <a className="flex flex-row ml-2 items-end justify-around underline underline-offset-auto text-blue-200 hover:text-indigo-300" href="">Google Drive
            <svg className="h-10 w-fit ml-2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M17 6L31 6 45 30 31 30z"></path><path fill="#1976D2" d="M9.875 42L16.938 30 45 30 38 42z"></path><path fill="#4CAF50" d="M3 30.125L9.875 42 24 18 17 6z"></path>
            </svg>
          </a>
        </h2> 
        <div className="bg-white rounded-lg shadow-lg p-4">
          <iframe
            src={googleDriveLink}
            title="Google Drive Photos"
            width="100%"
            height="600"
            className="rounded-lg"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default Photos;
