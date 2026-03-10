import React from 'react';
import NewsCarousel from '../components/NewCarousel';
import StatsCounter from '../components/StatsCounter';
import SocialMediaSection from '../components/SocialMediaSection';
import SubscriptionCallToAction from '../components/SubscriptionCallToAction';
import NewsSection from '../components/NewsSection';
import SEOHelmet from '../components/SEOHelmet';
import CountdownDisplay from '../components/CountDownDisplay';
import DrivePreviewSimple from '../components/DrivePreviewSimple';

function Home() {
  return (
    <div>
      <SEOHelmet title="Inicio - Modelo ONU La Plata" />
      <CountdownDisplay />
      {/* Carrusel de imagenes */}
      <NewsCarousel />

      {/* Contador de estadisticas */}
      <StatsCounter />

      {/* Nueva seccion de apoyo */}
      <SubscriptionCallToAction />

      {/* Seccion de Diarios de la ONU */}
      <DrivePreviewSimple />

      {/* <SocialMediaSection/> */}
      <NewsSection />
    </div>
  );
}

export default Home;
