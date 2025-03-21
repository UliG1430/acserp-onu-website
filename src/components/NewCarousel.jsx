import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { NextArrow, PrevArrow } from "./CarouselArrow";
import newsData from "../assets/noticias/newsData";
import LazyImage from "./LazyImage";

const slideVariant = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const NewsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative overflow-hidden">
      <div className="w-full max-w-full mx-auto">
        <Slider {...settings}>
          {newsData.map((news, index) => (
            <div key={index} className="relative overflow-hidden">
              <a href={`/noticias/${news.id}`} className="block w-full h-full">
                <motion.div
                  variants={slideVariant}
                  initial="hidden"
                  animate="visible"
                  className="relative w-full h-full"
                >
                  {/* Imagen con animación automática de zoom-in suave */}
                  <div className="overflow-hidden">
                    <LazyImage
                      src={news.img}
                      alt={news.title}
                      className="w-full h-[600px] object-cover animate-zoom"
                    />
                  </div>

                  {/* Fondo oscuro y título */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                  >
                    <h3 className="text-3xl font-bold text-white text-center">
                      {news.title}
                    </h3>
                  </motion.div>
                </motion.div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewsCarousel;
