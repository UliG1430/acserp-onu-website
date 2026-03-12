import React from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";
import { stagger, cardItem } from "../utils/motion";

const posts = [
  "https://www.instagram.com/p/DLlTQFePdfw/",
  "https://www.instagram.com/p/DAjykIcsv-O/",
  "https://www.instagram.com/p/DLit0e8unXV/",
];

const InstagramFeed = () => (
  <motion.div
    variants={stagger(0.1)}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {posts.map((post, i) => (
      <motion.div
        key={i}
        variants={cardItem}
        className="rounded-2xl overflow-hidden shadow-sm border border-gray-100
          hover:shadow-lg transition-shadow duration-300"
      >
        <InstagramEmbed url={post} width="100%" captioned />
      </motion.div>
    ))}
  </motion.div>
);

export default InstagramFeed;
