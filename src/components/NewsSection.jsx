import React, { useEffect, useRef, useState } from "react";
import news1 from "../assets/images/youtube.jpeg";
import news2 from "../assets/images/news2.png";

const additionalNews = [
  {
    title: "Seguinos en nuestro canal de YouTube",
    summary: "Suscribite a nuestro canal de YouTube para acceder a capacitaciones y recursos.",
    link: "#",
    img: news1,
  },
  {
    title: "Convenio con Fundacion ONU",
    summary: "Tenemos el honor de anunciar que la Fundación de Naciones Unidas (@unfoundation) ha reconocido a nuestra Organización.",
    link: "#",
    img: news2,
  },
  {
    title: "Jornada de voluntariado social",
    summary: "Nuestros colaboradores participan en la jornada anual de voluntariado.",
    link: "#",
    img: "https://via.placeholder.com/400x250",
  },
];

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

  // Usamos IntersectionObserver para detectar cuándo la sección entra en vista
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

      <div className="grid md:grid-cols-3 gap-8">
        {additionalNews.map((news, index) => (
          <div
            key={index}
            className={`bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-[2000ms] ease-out hover:scale-105 hover:shadow-2xl ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: `${index * 0.3}s`, // Agregamos un retraso para cada tarjeta
            }}
          >
            {/* Imagen */}
            <img
              src={news.img}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg mb-2"
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {news.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {truncateText(news.summary, 100)}
              </p>
              <a
                href={news.link}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Leer más
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
