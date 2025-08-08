import React from 'react';
import { bodies } from '../data/bodies';
import { useInView } from 'react-intersection-observer';
import SEOHelmet from '../components/SEOHelmet';

const Model = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden bg-gradient-to-b from-white to-blue-50">
      <SEOHelmet 
        title="Modelo - Modelo ONU La Plata"
        description="Explorá los órganos y comités del Modelo ONU La Plata, donde los estudiantes debaten y resuelven problemas globales."
      />

      {/* Intro */}
      <section className="bg-blue-950 text-white py-16 w-full px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Órganos</h1>
          <p className="text-lg md:text-xl font-medium leading-relaxed text-blue-100">
            Conocé todos los órganos que formaron parte de los Modelos Intercolegiales de Naciones Unidas en La Plata.
            A lo largo de los años, nuestra Asociación ha desarrollado una amplia variedad de órganos y comités,
            permitiendo a los y las participantes abordar las principales temáticas de la agenda internacional desde
            distintas perspectivas. Explorá cada uno y descubrí su impacto.
          </p>
        </div>
      </section>

      {/* Órganos con animaciones alternadas */}
      {bodies.map((body, index) => {
        const { ref, inView } = useInView({
          triggerOnce: true,
          threshold: 0.1,
        });

        const isEven = index % 2 === 0;
        const baseClasses = `w-full py-20 transition-opacity duration-700 ease-in-out`;
        const bgColor = isEven ? 'bg-white' : 'bg-blue-100';
        const animation = inView ? 'opacity-100' : 'opacity-0';

        const mobileOrder = "flex-col";
        const desktopOrder = isEven ? "md:flex-row" : "md:flex-row-reverse";

        return (
          <div
            key={body.id}
            ref={ref}
            className={`${baseClasses} ${bgColor} ${animation}`}
          >
            <div className={`max-w-7xl mx-auto px-6 flex ${mobileOrder} ${desktopOrder} items-center justify-between gap-10`}>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={body.logo}
                  alt={body.nombre}
                  className="object-contain drop-shadow-md w-80 h-40 md:w-[500px] md:h-[250px]"
                />
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4 border-b-2 md:border-b-0 md:border-l-4 md:pl-4 border-blue-500">
                  {body.nombre}
                </h2>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {body.descripcion}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Model;
