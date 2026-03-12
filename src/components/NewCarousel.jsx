import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { NextArrow, PrevArrow } from "./CarouselArrow";
import newsData from "../assets/noticias/newsData";
import parseDate from "../utils/parseDate";
import { shouldUseSafeMode } from "../utils/runtimeSafety";

/* No usamos LazyImage aquí — react-slick ya gestiona lazy loading con
   lazyLoad:"ondemand". LazyImage envuelve el img en un div sin altura
   lo que rompe el layout de height fija que necesita el carrusel. */

const NewsCarousel = () => {
  const safeMode = useMemo(() => shouldUseSafeMode(), []);
  const [isMobile, setIsMobile]   = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const height = isMobile ? "h-[300px]" : "h-[560px]";

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !safeMode,
    autoplaySpeed: 6000,
    lazyLoad: "ondemand",
    cssEase: "cubic-bezier(0.37, 0, 0.63, 1)",
    swipeToSlide: true,
    pauseOnHover: true,
    waitForAnimate: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => setIsSliding(true),
    afterChange: () => setIsSliding(false),
    appendDots: (dots) => (
      <div style={{ bottom: "18px" }}>
        <ul style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center", gap: "6px" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => <div className="ncarousel-dot" />,
  };

  const sortedNews = [...newsData].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <div className="relative overflow-hidden bg-gray-900">
      <Slider {...settings}>
        {sortedNews.map((news, index) => (
          <div key={index}>
            <Link
              to={`/noticias/${news.id}`}
              onClick={(e) => { if (isSliding) e.preventDefault(); }}
              className="block"
            >
              {/* Contenedor de altura fija — evita el problema de aspect-ratio con absolute */}
              <div className={`relative w-full overflow-hidden ${height}`}>

                {/* Imagen — img nativo, sin LazyImage */}
                <img
                  src={news.img}
                  alt={news.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover
                    ${safeMode ? "" : "ncarousel-zoom"}`}
                />

                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Texto */}
                <div className="absolute bottom-0 inset-x-0 px-5 sm:px-10 pb-10 sm:pb-16">
                  <div className="max-w-2xl">
                    {news.category && (
                      <span className="inline-block mb-2.5 px-3 py-1 rounded-full
                        text-[11px] font-semibold uppercase tracking-widest
                        bg-white/15 backdrop-blur-sm text-white/80">
                        {news.category}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem]
                      font-bold text-white leading-tight">
                      {news.title}
                    </h3>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        ))}
      </Slider>

      <style>{`
        /* Ken Burns: solo en el slide activo, reinicia en cada cambio */
        .ncarousel-zoom { transform-origin: center center; }
        .slick-slide.slick-active .ncarousel-zoom {
          animation: ncarouselKB 6.5s ease-out forwards;
        }
        @keyframes ncarouselKB {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        /* Dots */
        .ncarousel-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.35);
          transition: all 0.25s ease;
        }
        .slick-dots li.slick-active .ncarousel-dot {
          width: 24px;
          border-radius: 4px;
          background: white;
        }
        .slick-dots li button  { display: none; }
        .slick-dots li         { margin: 0; width: auto; height: auto; }
      `}</style>
    </div>
  );
};

export default NewsCarousel;
