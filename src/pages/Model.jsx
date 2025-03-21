import React from 'react';
import { bodies } from '../data/bodies'; // Importamos los órganos desde el archivo bodies.js
import { useInView } from 'react-intersection-observer';
import SEOHelmet from '../components/SEOHelmet'; // Importamos el SEOHelmet

const Model = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      {/* SEO Helmet */}
      <SEOHelmet 
        title="Modelo - Modelo ONU La Plata"
        description="Explorá los órganos y comités del Modelo ONU La Plata, donde los estudiantes debaten y resuelven problemas globales."
      />

      {bodies.map((body, index) => {
        const { ref, inView } = useInView({
          triggerOnce: true, 
          threshold: 0.3, 
        });

        return (
          <div
            key={body.id}
            ref={ref} 
            className={`flex w-full min-h-[70vh] py-10
              ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-950 to-indigo-300' : 'bg-gradient-to-l from-indigo-300 to-blue-950'}
              text-white`}
          >
            <div
              className={`flex w-full items-center justify-between max-w-[90%] mx-auto
                ${inView ? (index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right') : ''}`}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="w-1/2 flex justify-center">
                    <img src={body.logo} alt={body.nombre} className="w-40 h-40 md:w-60 md:h-60" />
                  </div>
                  <div className="w-1/2 text-left p-5">
                    <h2 className="text-4xl font-bold mb-4">{body.nombre}</h2>
                    <p className="text-lg">{body.descripcion}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-1/2 text-right p-5">
                    <h2 className="text-4xl font-bold mb-4">{body.nombre}</h2>
                    <p className="text-lg">{body.descripcion}</p>
                  </div>
                  <div className="w-1/2 flex justify-center">
                    <img src={body.logo} alt={body.nombre} className="w-40 h-40 md:w-60 md:h-60" />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Model;
