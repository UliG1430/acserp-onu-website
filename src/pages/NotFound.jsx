import React from "react";
import SEOHelmet from "../components/SEOHelmet";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* SEO Helmet */}
      <SEOHelmet 
        title="404 - Página No Encontrada" 
        description="Lo sentimos, la página que estás buscando no existe. Vuelve al inicio para seguir navegando en nuestro sitio." 
      />

      <h1 className="text-4xl font-bold text-red-500">404 - Página No Encontrada</h1>
      <p className="mt-4 text-lg">Lo sentimos, la página que estás buscando no existe.</p>
      <a href="/" className="mt-6 text-blue-500 underline">Volver al Inicio</a>
    </div>
  );
}

export default NotFound;
