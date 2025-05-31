import React from 'react';
import NewsCarousel from '../components/NewCarousel';
import StatsCounter from '../components/StatsCounter';
import SocialMediaSection from '../components/SocialMediaSection';
import SubscriptionCallToAction from '../components/SubscriptionCallToAction';
import NewsSection from '../components/NewsSection';
import SEOHelmet from '../components/SEOHelmet';

function Home() {
  return (
    <div>
      <SEOHelmet 
        title="Inicio - Modelo ONU La Plata"
      />

      {/* Carrusel de imágenes */}
      <NewsCarousel />

      {/* Contador de estadísticas */}
      <StatsCounter />

      {/* Nueva sección de apoyo mensual */}
      <SubscriptionCallToAction />

      {/* <SocialMediaSection/> */}
      <NewsSection />
    </div>
  );
}

export default Home;
