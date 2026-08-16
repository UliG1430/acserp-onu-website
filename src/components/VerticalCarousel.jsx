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
    background: "bg-[#f0f0f5]",
    title: "text-indigo-950",
    text: "text-gray-700",
  },
  {
    background: "bg-blue-950",
    title: "text-white",
    text: "text-gray-300",
  },
  {
    background: "bg-indigo-300",
    title: "text-indigo-950",
    text: "text-gray-700",
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
  const isReversed = index % 2 === 1;
  const layout = isReversed ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row";
  const animation = isReversed ? "animate-fade-in-right" : "animate-fade-in-left";

  return (
    <section ref={ref} className={`flex w-full items-center py-16 md:py-24 ${layout} ${style.background}`}>
      <div className={`w-full md:w-1/2 p-8 ${inView ? animation : "opacity-0"}`}>
        <CarouselMedia section={section} />
      </div>
      <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${inView ? animation : "opacity-0"}`}>
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
