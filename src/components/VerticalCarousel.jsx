import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { fadeLeft, fadeRight, viewport } from '../utils/motion';

import imageAgasajo1  from '../assets/images/agasajo1.webp';
import imageAgasajo2  from '../assets/images/agasajo2.webp';
import imageAgasajo3  from '../assets/images/agasajo3.webp';
import imageApertura1 from '../assets/images/apertura1.webp';
import imageApertura3 from '../assets/images/apertura3.webp';
import imageSesiones1 from '../assets/images/sesiones1.webp';
import imageSesiones2 from '../assets/images/sesiones2.webp';
import imageSesiones3 from '../assets/images/sesiones3.webp';

/* ── Carousel arrows ────────────────────────────────────────────────────── */
const GalleryNext = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Siguiente foto"
    className="absolute right-3 top-1/2 -translate-y-1/2 z-10
      flex items-center justify-center w-11 h-11 rounded-full
      bg-white/90 hover:bg-white shadow-md hover:shadow-lg
      text-gray-900 transition-all duration-200 hover:scale-105"
  >
    <ChevronRightIcon className="w-5 h-5" />
  </button>
);

const GalleryPrev = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Foto anterior"
    className="absolute left-3 top-1/2 -translate-y-1/2 z-10
      flex items-center justify-center w-11 h-11 rounded-full
      bg-white/90 hover:bg-white shadow-md hover:shadow-lg
      text-gray-900 transition-all duration-200 hover:scale-105"
  >
    <ChevronLeftIcon className="w-5 h-5" />
  </button>
);

/* ── Slider config ──────────────────────────────────────────────────────── */
const sliderSettings = (isLight = false) => ({
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  cssEase: 'cubic-bezier(0.37, 0, 0.63, 1)',
  nextArrow: <GalleryNext />,
  prevArrow: <GalleryPrev />,
  appendDots: (dots) => (
    <div style={{ bottom: '12px' }}>
      <ul style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', gap: '5px' }}>
        {dots}
      </ul>
    </div>
  ),
  customPaging: () => (
    <div
      className="gallery-dot"
      style={{
        width: '7px',
        height: '7px',
        borderRadius: '9999px',
        background: isLight ? 'rgba(18,20,69,0.3)' : 'rgba(255,255,255,0.4)',
        transition: 'all 0.2s ease',
      }}
    />
  ),
});

/* ── Sections data ──────────────────────────────────────────────────────── */
const sections = [
  {
    id: 'apertura',
    title: 'Acto de Apertura',
    desc: 'El inicio del evento, con discursos que inspiran a los delegados a dar lo mejor de sí mismos en el escenario del Estadio Único Diego Armando Maradona.',
    images: [
      { src: imageApertura1, alt: 'Acto de Apertura 1' },
      { src: imageApertura3, alt: 'Acto de Apertura 3' },
    ],
    bg: 'bg-white',
    textDark: true,
    imageLeft: true,
    dotLight: true,
  },
  {
    id: 'sesiones',
    title: 'Sesiones',
    desc: 'Los delegados debaten los temas más urgentes de la agenda global, proponiendo resoluciones y negociando acuerdos en los salones de la República de los Niños.',
    images: [
      { src: imageSesiones1, alt: 'Sesiones 1' },
      { src: imageSesiones2, alt: 'Sesiones 2' },
      { src: imageSesiones3, alt: 'Sesiones 3' },
    ],
    bg: 'bg-brand-950',
    textDark: false,
    imageLeft: false,
    dotLight: false,
  },
  {
    id: 'agasajo',
    title: 'Agasajo Diplomático',
    desc: 'Una noche especial en el Pasaje Dardo Rocha donde delegados y voluntarios celebran, socializan y crean conexiones que duran más allá del Modelo.',
    images: [
      { src: imageAgasajo1, alt: 'Agasajo 1' },
      { src: imageAgasajo2, alt: 'Agasajo 2' },
      { src: imageAgasajo3, alt: 'Agasajo 3' },
    ],
    bg: 'bg-slate-50',
    textDark: true,
    imageLeft: true,
    dotLight: true,
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
const VerticalCarousel = () => (
  <>
    {sections.map((sec) => {
      const textVariant  = sec.imageLeft ? fadeRight : fadeLeft;
      const imageVariant = sec.imageLeft ? fadeLeft : fadeRight;

      return (
        <section key={sec.id} className={`${sec.bg} py-16 md:py-24 overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col ${sec.imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}
              items-center gap-10 lg:gap-16`}
            >
              {/* ── Carousel ── */}
              <motion.div
                variants={imageVariant}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="w-full md:w-3/5 lg:w-[58%]"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-brand-lg">
                  <Slider {...sliderSettings(sec.dotLight)}>
                    {sec.images.map((img) => (
                      <div key={img.alt}>
                        {/* h fija para que object-cover funcione sin depender de LazyImage */}
                        <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden">
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>

                {/* custom dot active state */}
                <style>{`
                  .slick-dots li button { display: none; }
                  .slick-dots li { margin: 0; width: auto; height: auto; }
                  .slick-dots li.slick-active .gallery-dot {
                    width: 22px !important;
                    border-radius: 4px !important;
                    background: ${sec.textDark ? 'rgba(18,20,69,0.7)' : 'white'} !important;
                  }
                `}</style>
              </motion.div>

              {/* ── Text ── */}
              <motion.div
                variants={textVariant}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="w-full md:w-2/5 lg:w-[42%] text-center md:text-left space-y-5"
              >
                <span className={`text-xs font-semibold uppercase tracking-widest
                  ${sec.textDark ? 'text-brand-600' : 'text-blue-400'}`}>
                  VII Modelo ONU La Plata
                </span>
                <h2 className={`text-3xl lg:text-4xl font-bold leading-tight
                  ${sec.textDark ? 'text-gray-900' : 'text-white'}`}>
                  {sec.title}
                </h2>
                <p className={`text-base leading-relaxed
                  ${sec.textDark ? 'text-gray-500' : 'text-white/55'}`}>
                  {sec.desc}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      );
    })}
  </>
);

export default VerticalCarousel;
