import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import newsData from "../assets/noticias/newsData.js";
import LazyImage from "../components/LazyImage";
import parseDate from "../utils/parseDate";

const ITEMS_PER_PAGE = 6;

const sortedNewsData = [...newsData].sort((a, b) => {
  return parseDate(b.date) - parseDate(a.date);
});

const NewsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = Math.ceil(sortedNewsData.length / ITEMS_PER_PAGE);

  const paginatedNews = sortedNewsData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handlePageChange = (newPage, dir) => {
    if (newPage >= 0 && newPage < totalPages) {
      setDirection(dir);
      setCurrentPage(newPage);
    }
  };

  return (
    <div ref={sectionRef} className="px-4 py-12 bg-blue-950 relative">
      <h2
        className={`text-4xl font-bold text-center text-white mb-8 transition-opacity duration-[2000ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Últimas Noticias
      </h2>

      <div className="relative max-w-7xl mx-auto">
        {/* Flecha Izquierda */}
        <button
          onClick={() => handlePageChange(currentPage - 1, -1)}
          disabled={currentPage === 0}
          style={{ backgroundColor: "#787ac1" }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white text-5xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 disabled:opacity-30 hover:scale-110"
        >
          ‹
        </button>

        {/* Carrusel */}
        <div className="overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2"
            >
              {paginatedNews.map((news) => (
                <Link key={news.id} to={`/noticias/${news.id}`} className="block">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    }}
                    className="bg-white rounded-lg transition duration-300 cursor-pointer h-full flex flex-col"
                  >
                    <LazyImage
                      src={news.img}
                      alt={news.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6 bg-white rounded-b-lg text-blue-950 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{news.date}</p>
                      <p className="text-gray-700 mb-4 line-clamp-4">{news.summary}</p>
                      <span className="text-blue-600 font-semibold mt-auto">Leer más</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={() => handlePageChange(currentPage + 1, 1)}
          disabled={currentPage >= totalPages - 1}
          style={{ backgroundColor: "#787ac1" }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white text-5xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 disabled:opacity-30 hover:scale-110"
        >
          ›
        </button>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i, i > currentPage ? 1 : -1)}
            className={`w-3 h-3 rounded-full transition ${
              i === currentPage ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
