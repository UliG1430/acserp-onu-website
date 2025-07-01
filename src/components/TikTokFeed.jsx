import React from "react";
import { TikTokEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";

// Variantes de animación
const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const TikTokFeed = () => {
  const tikTokLinks = [
    "https://www.tiktok.com/@modeloonulp/video/7515939053162859781",
    "https://www.tiktok.com/@modeloonulp/video/7216504495075757318",
    "https://www.tiktok.com/@modeloonulp/video/7420543059194105094",
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {tikTokLinks.map((link, index) => (
        <motion.div
          key={index}
          variants={fadeInVariant}
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300"
        >
          <TikTokEmbed url={link} width="100%" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TikTokFeed;
