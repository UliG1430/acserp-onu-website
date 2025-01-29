import React from 'react';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import imageAgasajo1 from '../assets/images/agasajo1.JPG';
import imageAgasajo2 from '../assets/images/agasajo2.JPG';
import imageAgasajo3 from '../assets/images/agasajo3.JPG';
import imageApertura1 from '../assets/images/apertura1.JPG';
import imageApertura2 from '../assets/images/apertura2.JPG';
import imageApertura3 from '../assets/images/apertura3.JPG';
import imageSesiones1 from '../assets/images/sesiones1.JPG';
import imageSesiones2 from '../assets/images/sesiones2.JPG';
import imageSesiones3 from '../assets/images/sesiones3.JPG';

const VerticalCarousel = () => {
  const { ref: agasajoRef, inView: agasajoInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: aperturaRef, inView: aperturaInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: sesionesRef, inView: sesionesInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,  // Animación más lenta
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,  // Más tiempo entre cambios de slide
  };

  return (
    <div className="min-h-screen bg-[#f0f0f5]">
      {/* Agasajo Diplomático - Carrusel (Gris) */}
      <section ref={agasajoRef} className="w-full flex flex-col md:flex-row items-center py-16 md:py-24 border-gray-300">
        <div className={`w-full md:w-1/2 p-8 ${agasajoInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <img src={imageAgasajo1} alt="Agasajo Diplomático 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageAgasajo2} alt="Agasajo Diplomático 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageAgasajo3} alt="Agasajo Diplomático 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${agasajoInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-indigo-950 mb-4">Agasajo Diplomático</h2>
          <p className="text-lg text-gray-700">El agasajo diplomático es un evento donde los representantes tienen la oportunidad de socializar y establecer conexiones valiosas.</p>
        </div>
      </section>

      {/* Acto de Apertura - Carrusel (Azul) */}
      <section ref={aperturaRef} className="w-full flex flex-col md:flex-row-reverse items-center py-16 md:py-24 bg-blue-950">
        <div className={`w-full md:w-1/2 p-8 ${aperturaInView ? 'animate-fade-in-right' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <img src={imageApertura1} alt="Acto de Apertura 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageApertura2} alt="Acto de Apertura 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageApertura3} alt="Acto de Apertura 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${aperturaInView ? 'animate-fade-in-right' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-white mb-4">Acto de Apertura</h2>
          <p className="text-lg text-gray-300">El acto de apertura marca el comienzo del evento, con discursos que inspiran a los delegados a dar lo mejor de sí mismos.</p>
        </div>
      </section>

      {/* Sesiones - Carrusel (Índigo) */}
      <section ref={sesionesRef} className="w-full flex flex-col md:flex-row items-center py-16 md:py-24 bg-indigo-300">
        <div className={`w-full md:w-1/2 p-8 ${sesionesInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <Slider {...settings}>
            <div>
              <img src={imageSesiones1} alt="Sesiones 1" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageSesiones2} alt="Sesiones 2" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
            <div>
              <img src={imageSesiones3} alt="Sesiones 3" className="w-full h-[450px] object-cover rounded-lg shadow-lg" />
            </div>
          </Slider>
        </div>
        <div className={`w-full md:w-1/2 p-8 text-center md:text-left ${sesionesInView ? 'animate-fade-in-left' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-indigo-950 mb-4">Sesiones</h2>
          <p className="text-lg text-gray-700">Durante las sesiones, los delegados debaten temas importantes a nivel global, proponiendo soluciones innovadoras.</p>
        </div>
      </section>
    </div>
  );
};

export default VerticalCarousel;
