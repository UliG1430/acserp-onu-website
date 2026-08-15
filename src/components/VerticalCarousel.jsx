import React from "react";
import Slider from "react-slick";
import { useInView } from "react-intersection-observer";
import LazyImage from "./LazyImage";
import { buildGoogleDriveEmbedUrl } from "../utils/googleDrive";

const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
};

const sectionStyles = [
  {
    container: "bg-[#f0f0f5] flex-col md:flex-row",
    title: "text-indigo-950",
    text: "text-gray-700",
    animation: "animate-fade-in-left",
  },
  {
    container: "bg-blue-950 flex-col md:flex-row-reverse",
    title: "text-white",
    text: "text-gray-300",
    animation: "animate-fade-in-right",
  },
  {
    container: "bg-indigo-300 flex-col md:flex-row",
    title: "text-indigo-950",
    text: "text-gray-700",
    animation: "animate-fade-in-left",
  },
];

const CarouselMedia = ({ section }) => {
  const embedUrl = buildGoogleDriveEmbedUrl(section.folderUrl || "");

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={section.title}
        width="100%"
        height="450"
        className="w-full rounded-lg bg-white shadow-lg"
        frameBorder="0"
      />
    );
  }

  const images = Array.isArray(section.images) ? section.images.filter((image) => image.src) : [];
  if (images.length === 0) {
    return <div className="flex h-[450px] items-center justify-center rounded-lg bg-white text-sm text-gray-500 shadow-lg">Sin fotos cargadas</div>;
  }

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={`${section.id || section.title}-${index}`}>
          <LazyImage
            src={image.src}
            alt={image.alt || section.title}
            className="h-[450px] w-full rounded-lg object-cover shadow-lg"
          />
        </div>
      ))}
    </Slider>
  );
};

const CarouselSection = ({ section, index }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const style = sectionStyles[index % sectionStyles.length];

  return (
    <section ref={ref} className={`flex w-full items-center py-16 md:py-24 ${style.container}`}>
      <div className={`w-full md:w-1/2 p-8 ${inView ? style.animation : "opacity-0"}`}>
        <CarouselMedia section={section} />
      </div>
      <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${inView ? style.animation : "opacity-0"}`}>
        <h2 className={`mb-4 text-4xl font-bold ${style.title}`}>{section.title}</h2>
        <p className={`text-lg ${style.text}`}>{section.subtitle}</p>
      </div>
    </section>
  );
};

const VerticalCarousel = ({ sections = [] }) => {
  const visibleSections = sections.filter((section) => !section.hidden);

  if (visibleSections.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f0f0f5]">
      {visibleSections.map((section, index) => (
        <CarouselSection key={section.id || section.title} section={section} index={index} />
      ))}
    </div>
  );
};

export default VerticalCarousel;
