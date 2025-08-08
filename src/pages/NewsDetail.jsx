import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import newsData from "../assets/noticias/newsData";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SEOHelmet from "../components/SEOHelmet";
import YouTubeEmbed from "../components/YouTubeEmbed";

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

  const recommendedNews = newsData
    .filter((item) => item.id !== news.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const content = news.content.trim();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <SEOHelmet 
        title={news.title} 
        description={news.summary || "Lee esta noticia sobre el Modelo ONU La Plata"} 
        url={`https://acserp.org.ar/noticias/${news.id}`} 
        image={news.img} 
      />

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
          className="w-full h-[600px] object-cover rounded-lg shadow-lg"
        />
      </motion.figure>

      {/* Contenido */}
      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg leading-relaxed text-gray-800 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Imágenes adicionales */}
        {news.additionalImages && news.additionalImages.map((image, index) => (
          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
          >
            <img
              src={image.url}
              alt={`Imagen ${index + 1}`}
              className="w-full h-[600px] object-cover rounded-xl shadow-lg transition-transform duration-500 hover:scale-105"
            />
            {image.description && (
              <figcaption className="text-gray-600 text-sm mt-2 text-center">
                {image.description}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </section>

      {/* Video de YouTube (si existe) */}
      {news.youtubeId && (
        <section className="mt-12">
          <YouTubeEmbed 
            videoId={news.youtubeId} 
            title={`Video: ${news.title}`}
          />
        </section>
      )}

      {/* Noticias Recomendadas */}
      <section id="recommended-news" className="mt-20">
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

      {/* Volver */}
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

      <ScrollToTopButton />
    </div>
  );
};

export default NewsDetail;
