import React from "react";
import { TikTokEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";
import { stagger, cardItem } from "../utils/motion";

const tikTokLinks = [
  "https://www.tiktok.com/@modeloonulp/video/7515939053162859781",
  "https://www.tiktok.com/@modeloonulp/video/7216504495075757318",
  "https://www.tiktok.com/@modeloonulp/video/7420543059194105094",
];

const TikTokFeed = () => (
  <motion.div
    variants={stagger(0.1)}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {tikTokLinks.map((link, i) => (
      <motion.div
        key={i}
        variants={cardItem}
        className="rounded-2xl overflow-hidden shadow-sm border border-gray-100
          hover:shadow-lg transition-shadow duration-300"
      >
        <TikTokEmbed url={link} width="100%" />
      </motion.div>
    ))}
  </motion.div>
);

export default TikTokFeed;
