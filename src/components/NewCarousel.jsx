import React from "react";
import Slider from "react-slick";

import { NextArrow, PrevArrow } from "./CarouselArrow"; // Flechas

import noticia1 from "../assets/images/noticia1.JPG";
import noticia2 from "../assets/images/noticia2.JPG";
import noticia3 from "../assets/images/noticia3.JPG";

const newsData = [
  {
    title: "Finalizamos las capacitaciones de cara al inicio del Modelo 2024",
    img: noticia1,
    link: "#",
  },
  {
    title: "Noticia 2",
    img: noticia2,
    link: "#",
  },
  {
    title: "Noticia 3",
    img: noticia3,
    link: "#",
  },
];

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
            <a href={news.link} className="block w-full h-full">
              <div className="relative h-full w-full">
                {/* Efecto de zoom-in lento en todas las imágenes */}
                <img
                  src={news.img}
                  alt={news.title}
                  className="w-full h-full object-cover animated-zoom"
                />
                {/* Fondo opaco y título */}
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
