import React from "react";
import InstagramFeed from "../components/InstagramFeed";
import TikTokFeed from "../components/TikTokFeed";

const SocialMediaPage = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-blue-950 text-center mb-12">
          Redes Sociales
        </h1>

        {/* TikTok Section */}
        <TikTokFeed />

        {/* Instagram Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Instagram</h2>
          <InstagramFeed /> {/* Usa tu componente InstagramFeed */}
        </div>

        {/* YouTube Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">YouTube</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Inserta videos de YouTube */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Video 1
              title="YouTube Video 1"
              className="w-full h-72 rounded-lg shadow-lg"
              allow="autoplay; encrypted-media"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/3JZ_D3ELwOQ" // Video 2
              title="YouTube Video 2"
              className="w-full h-72 rounded-lg shadow-lg"
              allow="autoplay; encrypted-media"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/kJQP7kiw5Fk" // Video 3
              title="YouTube Video 3"
              className="w-full h-72 rounded-lg shadow-lg"
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaPage;
