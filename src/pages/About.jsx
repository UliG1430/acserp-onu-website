import React from "react";
import SEOHelmet from "../components/SEOHelmet";

function About() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center">
      <SEOHelmet 
        title="Acerca de Nosotros - Modelo ONU La Plata"
        description="Conoce más sobre nuestra organización y el impacto de nuestros simulacros educativos en la región del Río de la Plata."
      />

      <h1 className="text-3xl font-bold">Acerca de Nosotros</h1>
      <p className="mt-4 text-lg text-center max-w-2xl">
        Somos una organización dedicada a los simulacros educativos en la región del Río de la Plata, proporcionando a los estudiantes la oportunidad de involucrarse en la simulación de organismos internacionales.
      </p>
    </div>
  );
}

export default About;
