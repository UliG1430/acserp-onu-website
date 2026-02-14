import React from 'react';
import NewsCarousel from '../components/NewCarousel';
import StatsCounter from '../components/StatsCounter';
import SocialMediaSection from '../components/SocialMediaSection';
import SubscriptionCallToAction from '../components/SubscriptionCallToAction';
import NewsSection from '../components/NewsSection';
import SEOHelmet from '../components/SEOHelmet';
import CountdownDisplay from '../components/CountDownDisplay'; // Asegúrate de que la ruta sea correcta
import DrivePreviewSimple from '../components/DrivePreviewSimple';
function Home() {
  return (
    <div>
      <SEOHelmet 
        title="Inicio - Modelo ONU La Plata"
      />
      <CountdownDisplay/>
      {/* Carrusel de imágenes */}
      <NewsCarousel />
      

      {/* Contador de estadísticas */}
      <StatsCounter />

      {/* Nueva sección de apoyo mensual */}
      <SubscriptionCallToAction />

      {/* Sección de Diarios de la ONU */}
      <DrivePreviewSimple />

      {/* <SocialMediaSection/> */}
      <NewsSection />
    </div>
  );
}

export default Home;
