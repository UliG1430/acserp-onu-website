import React from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";

const InstagramFeed = () => {
  const posts = [
    "https://www.instagram.com/p/DLlTQFePdfw/",
    "https://www.instagram.com/p/DAjykIcsv-O/",
    "https://www.instagram.com/p/DLit0e8unXV/"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300"
        >
          <InstagramEmbed url={post} width="100%" captioned />
        </motion.div>
      ))}
    </div>
  );
};

export default InstagramFeed;
