import React, { useState, useEffect } from 'react';
import image1 from '../assets/images/image1.JPG';
import image2 from '../assets/images/image2.JPG';
import image3 from '../assets/images/image3.JPG';
import image4 from '../assets/images/noticia3.JPG';
import image5 from '../assets/images/noticia2.JPG';
import image6 from '../assets/images/noticia1.JPG';

const sections = [
  {
    title: "Agasajo diplomático",
    images: [image1, image2],
  },
  {
    title: "Acto de Apertura",
    images: [image3, image4],
  },
  {
    title: "Sesiones",
    images: [image5, image6],
  }
];

const VerticalCarousel = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prevSection) => (prevSection + 1) % sections.length);
    }, 5000); // Cambia de sección cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden relative">
      {/* Título de la sección */}
      <h2 className="text-4xl font-bold text-center text-white mb-6 animate-fade">{sections[currentSection].title}</h2>

      {/* Carrusel de imágenes */}
      <div className="grid grid-cols-2 gap-8 transition-transform duration-700 ease-in-out transform">
        {sections[currentSection].images.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg group">
            <img
              src={image}
              alt={`Imagen ${index + 1}`}
              className="w-full h-64 object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between px-4">
        <button
          className="text-white bg-indigo-950 px-4 py-2 rounded-full hover:bg-indigo-800"
          onClick={() =>
            setCurrentSection((currentSection - 1 + sections.length) % sections.length)
          }
        >
          &#8593; {/* Flecha arriba */}
        </button>
        <button
          className="text-white bg-indigo-950 px-4 py-2 rounded-full hover:bg-indigo-800"
          onClick={() =>
            setCurrentSection((currentSection + 1) % sections.length)
          }
        >
          &#8595; {/* Flecha abajo */}
        </button>
      </div>
    </div>
  );
};

export default VerticalCarousel;
