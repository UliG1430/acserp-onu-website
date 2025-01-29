import React from "react";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./CarouselArrow"; // Flechas personalizadas
import newsData from "../assets/noticias/newsData"; // Importamos las noticias dinámicamente

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
    <div className="relative w-screen mt-0 overflow-hidden">
      <Slider {...settings}>
        {newsData.map((news, index) => (
          <div key={index} className="relative h-[500px] overflow-hidden">
            <a href={`/noticias/${news.id}`} className="block w-full h-full">
              <div className="relative h-full w-full">
                {/* Imagen de la noticia */}
                <img
                  src={news.img}
                  alt={news.title}
                  className="w-full h-full object-cover animated-zoom"
                />
                {/* Fondo oscuro con título */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <h3 className="text-3xl font-bold text-white text-center">
                    {news.title}
                  </h3>
                </div>
              </div>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsCarousel;
