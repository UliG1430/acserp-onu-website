import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Para enlaces dinámicos
import newsData from "../assets/noticias/newsData.js";
// Función para truncar el texto y agregar "..."
const truncateText = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

const NewsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Usamos IntersectionObserver para animaciones de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Deja de observar una vez que entra en vista
          }
        });
      },
      { threshold: 0.3 } // Se activa cuando el 30% del elemento es visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="mt-16 max-w-7xl mx-auto px-4 mb-16">
      {/* Título con animación de fade */}
      <h2
        className={`text-4xl font-bold text-center mb-8 transition-opacity duration-[2000ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Últimas Noticias
      </h2>

      {/* Grid de noticias */}
      <div className="grid md:grid-cols-3 gap-8">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className={`bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-[2000ms] ease-out hover:scale-105 hover:shadow-2xl ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: `${index * 0.3}s`, // Agregamos un retraso para cada tarjeta
            }}
          >
            {/* Imagen de la noticia */}
            <img
              src={news.img}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg mb-2"
            />

            {/* Contenido de la noticia */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {news.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {truncateText(news.summary, 100)}
              </p>
              <Link
                to={`/noticias/${news.id}`} // Enlace dinámico a la página de detalle
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Leer más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
