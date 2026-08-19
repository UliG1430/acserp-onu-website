import React from "react";
import SEOHelmet from "../components/SEOHelmet";
import HeroSection from "../components/HeroSection";
import ACSERPContent from "../components/ACSERPContent";
import heroImg from "../assets/images/acserp1.webp";

const ACSERPPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <SEOHelmet
        title="ACSERP - Asociación Civil Simulacros Educativos Río de la Plata"
        description="Descubre más sobre la Asociación Civil Simulacros Educativos Río de la Plata y su compromiso con la educación pública y gratuita."
      />

      <HeroSection image={heroImg} />
      <ACSERPContent />
    </div>
  );
};

export default ACSERPPage;
