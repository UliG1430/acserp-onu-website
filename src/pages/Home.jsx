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
      <SEOHelmet
        title="Modelo ONU La Plata - ACSERP"
        description="Modelo ONU La Plata es un simulacro educativo de Naciones Unidas organizado por ACSERP, con participacion estudiantil y educacion publica y gratuita."
        url="https://acserp.org.ar/"
      />
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
