import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; 
import newsData from "../assets/noticias/newsData.js";
import LazyImage from "../components/LazyImage"; // Asegúrate de tener este componente creado

const truncateText = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

const NewsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
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
    <div ref={sectionRef} className="px-4 py-12 bg-blue-950">
      {/* Título con animación */}
      <h2
        className={`text-4xl font-bold text-center text-white mb-8 transition-opacity duration-[2000ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Últimas Noticias
      </h2>

      {/* Grid de noticias */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className={`bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-[2000ms] ease-out hover:scale-105 hover:shadow-2xl ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: `${index * 0.3}s`,
            }}
          >
            {/* Imagen de la noticia */}
            <LazyImage
              src={news.img}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />

            {/* Contenido de la noticia */}
            <div className="p-6 bg-white rounded-b-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-950">
                {news.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {truncateText(news.summary, 100)}
              </p>
              <Link
                to={`/noticias/${news.id}`}
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
