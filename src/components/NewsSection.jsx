import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import newsData from "../assets/noticias/newsData.js";
import LazyImage from "../components/LazyImage";
import parseDate from "../utils/parseDate";

const NEWS_FADE_STEP_MS = 220;

const sortedNewsData = [...newsData].sort((a, b) => {
  return parseDate(b.date) - parseDate(a.date);
});

const NewsSection = () => {
  const sectionRef = useRef(null);
  const hasTriggeredRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(0);

  const getItemsPerPage = () => (window.innerWidth < 768 ? 2 : 6);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.22 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setVisibleItems(0);
      return;
    }

    setVisibleItems(0);
    const timers = [];

    for (let index = 0; index < itemsPerPage; index += 1) {
      const timer = window.setTimeout(() => {
        setVisibleItems(index + 1);
      }, index * NEWS_FADE_STEP_MS);
      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isVisible, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedNewsData.length / itemsPerPage);

  const paginatedNews = sortedNewsData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setVisibleItems(0);
    setCurrentPage(newPage);
  };

  return (
    <section ref={sectionRef} className="px-4 py-12 bg-blue-950 relative">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-4xl font-bold text-center text-white mb-8"
      >
        {"\u00daltimas Noticias"}
      </motion.h2>

      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          style={{ backgroundColor: "#787ac1" }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white text-5xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 disabled:opacity-30 hover:scale-110"
          aria-label="Noticias anteriores"
        >
          {"<"}
        </button>

        <div className="overflow-visible">
          <div
            key={currentPage}
            className={`grid grid-cols-1 ${
              itemsPerPage <= 2 ? "sm:grid-cols-2" : "md:grid-cols-3 lg:grid-cols-3"
            } gap-8 px-2`}
          >
            {paginatedNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0 }}
                animate={isVisible && index < visibleItems ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <Link to={`/noticias/${news.id}`} className="block h-full">
                  <motion.article
                    whileHover={{
                      scale: 1.03,
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
                      <span className="text-blue-600 font-semibold mt-auto">{"Leer m\u00e1s"}</span>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          style={{ backgroundColor: "#787ac1" }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white text-5xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-300 disabled:opacity-30 hover:scale-110"
          aria-label="Noticias siguientes"
        >
          {">"}
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === currentPage ? "bg-white scale-125" : "bg-gray-400"
            }`}
            aria-label={`Ir a la p\u00e1gina ${i + 1} de noticias`}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
