import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import newsData from "../assets/noticias/newsData.js";
import parseDate from "../utils/parseDate";
import { headingVariants, viewport } from "../utils/motion";

const ease = [0.16, 1, 0.3, 1];

const sortedNewsData = [...newsData].sort(
  (a, b) => parseDate(b.date) - parseDate(a.date)
);

/* Grid: fade-out rápido al salir, stagger en la entrada */
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

/* Cada card: sube suavemente al aparecer */
const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

const NewsSection = () => {
  const sectionRef   = useRef(null);
  const hasTriggered = useRef(false);
  const [isVisible, setIsVisible]     = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const getItemsPerPage = () => (window.innerWidth < 768 ? 2 : 6);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  useEffect(() => {
    const onResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTriggered.current) return;
        hasTriggered.current = true;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const totalPages    = Math.ceil(sortedNewsData.length / itemsPerPage);
  const paginatedNews = sortedNewsData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goTo = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Últimas Noticias</h2>
          <div className="mt-3 mx-auto w-10 h-0.5 rounded-full bg-white/20" />
        </motion.div>

        {/* ── Grid con stagger en cada cambio de página ── */}
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentPage}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginatedNews.map((news) => (
                <motion.div key={news.id} variants={cardVariants}>
                  <Link to={`/noticias/${news.id}`} className="block h-full group">
                    <motion.article
                      whileHover={{ y: -5, transition: { duration: 0.22, ease } }}
                      className="bg-white rounded-xl overflow-hidden h-full flex flex-col
                        shadow-sm hover:shadow-2xl transition-shadow duration-300"
                    >
                      {/* Imagen */}
                      <div className="relative h-44 overflow-hidden shrink-0">
                        <img
                          src={news.img}
                          alt={news.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover
                            group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-5 flex flex-col flex-grow">
                        {news.category && (
                          <span className="inline-block mb-2 text-[11px] font-semibold
                            uppercase tracking-wider text-brand-600">
                            {news.category}
                          </span>
                        )}
                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5
                          line-clamp-2 leading-snug">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">{news.date}</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3
                          flex-grow leading-relaxed">
                          {news.summary}
                        </p>
                        <span className="text-xs font-semibold text-brand-600
                          group-hover:text-brand-700 transition-colors">
                          Leer más →
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Paginación ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">

            {/* Flecha izquierda */}
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Página anterior"
              className="flex items-center justify-center w-10 h-10 rounded-full
                bg-white/15 text-white border border-white/20
                hover:bg-white hover:text-brand-900
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200 hover:scale-105"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2 items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Página ${i + 1}`}
                  className={`rounded-full transition-all duration-300
                    ${i === currentPage
                      ? "w-6 h-2.5 bg-white"
                      : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                />
              ))}
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Página siguiente"
              className="flex items-center justify-center w-10 h-10 rounded-full
                bg-white/15 text-white border border-white/20
                hover:bg-white hover:text-brand-900
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200 hover:scale-105"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>

          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
