import React from 'react';
import { motion } from 'framer-motion';

const YouTubeEmbed = ({ videoId, title = "Video de YouTube" }) => {
  if (!videoId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`} 
          title={title} 
          className="absolute top-0 left-0 w-full h-full rounded-lg" 
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
};

export default YouTubeEmbed;