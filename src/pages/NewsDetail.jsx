import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Animaciones
import newsData from "../assets/noticias/newsData";
import ScrollToTopButton from "../components/ScrollToTopButton";

const NewsDetail = () => {
  const { id } = useParams();
  const news = newsData.find((item) => item.id === parseInt(id));

  if (!news) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-red-600">Noticia no encontrada</h1>
        <p className="text-gray-700 mt-4">La noticia que buscas no está disponible.</p>
      </div>
    );
  }

  // Filtrar noticias recomendadas (excluyendo la actual)
  const recommendedNews = newsData
    .filter((item) => item.id !== news.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Divide el contenido en párrafos
  const paragraphs = news.content.trim().split("\n").filter((p) => p);

  // Estado para controlar la animación al hacer scroll
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detectar cuando la sección de noticias recomendadas entra en pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("recommended-news");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Encabezado */}
      <header className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-blue-950 mb-4 leading-tight"
        >
          {news.title}
        </motion.h1>
        <p className="text-gray-500 text-sm">{news.date}</p>
      </header>

      {/* Imagen Principal */}
      <motion.figure
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <img
          src={news.img}
          alt={news.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <figcaption className="text-gray-500 text-sm mt-2 text-center">
          Imagen principal
        </figcaption>
      </motion.figure>

      {/* Contenido con Imágenes Alternadas */}
      <section className="space-y-8">
        {paragraphs.map((paragraph, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-start gap-4`}
          >
            <p className="text-lg leading-relaxed text-gray-800 flex-1">{paragraph}</p>

            {/* Imagen Adicional */}
            {news.additionalImages && news.additionalImages[index] && (
              <figure className="flex-shrink-0 w-full md:w-1/3">
                <motion.img
                  src={news.additionalImages[index].url}
                  alt={`Imagen adicional ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                />
                <figcaption className="text-gray-600 text-sm mt-2 text-center">
                  {news.additionalImages[index].description}
                </figcaption>
              </figure>
            )}
          </motion.div>
        ))}
      </section>

      {/* 🔥 Noticias Recomendadas con Animaciones */}
      <section id="recommended-news" className="mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-blue-950 mb-6"
        >
          Noticias Recomendadas
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {recommendedNews.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/noticias/${item.id}`}
                className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.date}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Botón Volver */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-950 text-white text-lg rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
        >
          Volver a Inicio
        </Link>
      </motion.div>
      <ScrollToTopButton/>
    </div>
  );
};

export default NewsDetail;
