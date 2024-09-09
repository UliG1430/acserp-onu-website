import React from 'react';
import NewsCarousel from '../components/NewCarousel';
import StatsCounter from '../components/StatsCounter';

function Home() {
  return (
    <div>
    {/* Carrusel de imágenes */}
    <NewsCarousel />

    {/* Contador de estadísticas */}
    <StatsCounter />
  </div>

  );
}

export default Home;
