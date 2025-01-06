import React from "react";
import { InstagramEmbed } from "react-social-media-embed";

const InstagramFeed = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-blue-950 text-center mb-12">
          Feed de Instagram
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Inserta múltiples publicaciones de Instagram */}
          <InstagramEmbed
            url="https://www.instagram.com/p/DAjykIcsv-O/?igsh=YnBjdjZ0d2ZnNjdy" // Reemplaza con el enlace de tu publicación
            width="100%"
          />
          <InstagramEmbed
            url="https://www.instagram.com/p/CuiNh86szHv/?igsh=MWF6cXI4YmpkNjc1NQ==" // Otra publicación
            width="100%"
          />
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
