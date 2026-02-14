import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { NextArrow, PrevArrow } from "./CarouselArrow";
import newsData from "../assets/noticias/newsData";
import LazyImage from "./LazyImage";
import parseDate from "../utils/parseDate";
import { shouldUseSafeMode } from "../utils/runtimeSafety";

const NewsCarousel = () => {
  const safeMode = useMemo(() => shouldUseSafeMode(), []);
  const [isMobile, setIsMobile] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const settings = {
    dots: true,
    infinite: !isMobile,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !(safeMode || isMobile),
    autoplaySpeed: 6000,
    lazyLoad: "ondemand",
    cssEase: "ease-out",
    swipeToSlide: true,
    waitForAnimate: false,
    useTransform: !isMobile,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => setIsSliding(true),
    afterChange: () => setIsSliding(false),
  };

  const sortedNews = [...newsData].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  return (
    <div className="relative overflow-hidden">
      <div className="w-full max-w-full mx-auto">
        <Slider {...settings}>
          {sortedNews.map((news, index) => (
            <div key={index} className="relative overflow-hidden">
              <Link
                to={`/noticias/${news.id}`}
                onClick={(e) => {
                  if (isSliding) e.preventDefault();
                }}
                className="block w-full h-full"
              >
                <div className="relative w-full h-full">
                  <div className="overflow-hidden">
                    <LazyImage
                      src={news.img}
                      alt={news.title}
                      className={`w-full ${isMobile ? "h-[320px]" : "h-[600px]"} object-cover ${safeMode ? "" : "animate-zoom"}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
                    <h3 className="text-xl md:text-3xl font-bold text-white text-center">{news.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewsCarousel;
