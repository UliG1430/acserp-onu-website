import React from "react";
import { TikTokEmbed } from "react-social-media-embed";

const TikTokFeed = () => {
  // Lista de URLs de los videos de TikTok
  const tikTokLinks = [
    "https://vm.tiktok.com/ZMkB7X1Jv/",
    "https://vm.tiktok.com/ZMkB7UPnq/",
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">TikTok</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Renderiza los videos de TikTok */}
        {tikTokLinks.map((link, index) => (
          <TikTokEmbed
            key={index}
            url={link}
            width="100%"
          />
        ))}
      </div>
    </section>
  );
};

export default TikTokFeed;
