import React from 'react';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import LazyImage from './LazyImage';

import imageAgasajo1 from '../assets/images/agasajo1.webp';
import imageAgasajo2 from '../assets/images/agasajo2.webp';
import imageAgasajo3 from '../assets/images/agasajo3.webp';
import imageApertura1 from '../assets/images/apertura1.webp';
import imageApertura2 from '../assets/images/apertura2.webp';
import imageApertura3 from '../assets/images/apertura3.webp';
import imageSesiones1 from '../assets/images/sesiones1.webp';
import imageSesiones2 from '../assets/images/sesiones2.webp';
import imageSesiones3 from '../assets/images/sesiones3.webp';


const VerticalCarousel = () => {
  const { ref: aperturaRef, inView: aperturaInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: sesionesRef, inView: sesionesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: agasajoRef, inView: agasajoInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="min-h-screen bg-[#f0f0f5]">
      <section ref={aperturaRef} className="w-full flex flex-col md:flex-row items-center py-16 md:py-24 border-gray-300">
        <div className={`w-full md:w-1/2 p-8 ${aperturaInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <LazyImage src={imageApertura1} alt="Acto de Apertura 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageApertura2} alt="Acto de Apertura 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageApertura3} alt="Acto de Apertura 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${aperturaInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-indigo-950 mb-4">Acto de Apertura</h2>
          <p className="text-lg text-gray-700">El acto de apertura marca el comienzo del evento, con discursos que inspiran a los delegados a dar lo mejor de sí mismos.</p>
        </div>
      </section>

      <section ref={sesionesRef} className="w-full flex flex-col md:flex-row-reverse items-center py-16 md:py-24 bg-blue-950">
        <div className={`w-full md:w-1/2 p-8 ${sesionesInView ? 'animate-fade-in-right' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <LazyImage src={imageSesiones1} alt="Sesiones 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageSesiones2} alt="Sesiones 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageSesiones3} alt="Sesiones 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${sesionesInView ? 'animate-fade-in-right' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-white mb-4">Sesiones</h2>
          <p className="text-lg text-gray-300">Durante las sesiones, los delegados debaten temas importantes a nivel global, proponiendo soluciones innovadoras.</p>
        </div>
      </section>

      <section ref={agasajoRef} className="w-full flex flex-col md:flex-row items-center py-16 md:py-24 bg-indigo-300">
        <div className={`w-full md:w-1/2 p-8 ${agasajoInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <LazyImage src={imageAgasajo1} alt="Agasajo Diplomático 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageAgasajo2} alt="Agasajo Diplomático 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <LazyImage src={imageAgasajo3} alt="Agasajo Diplomático 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${agasajoInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-indigo-950 mb-4">Agasajo Diplomático</h2>
          <p className="text-lg text-gray-700">El agasajo diplomático es un evento donde los representantes tienen la oportunidad de socializar y establecer conexiones valiosas.</p>
        </div>
      </section>
    </div>
  );
};

export default VerticalCarousel;
