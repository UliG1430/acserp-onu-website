import React from 'react';
import NewsCarousel from '../components/NewCarousel';
import StatsCounter from '../components/StatsCounter';
import SocialMediaSection from '../components/SocialMediaSection';

function Home() {
  return (
    <div>
    {/* Carrusel de imágenes */}
    <NewsCarousel />

    {/* Contador de estadísticas */}
    <StatsCounter />
    <SocialMediaSection/>
  </div>

  );
}

export default Home;
