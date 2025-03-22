import React from "react";
import { LinkedInEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";

// Variantes de animación
const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const linkedInPosts = [
  {
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7232821551501324290",
    postUrl: "https://www.linkedin.com/posts/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230_durante-el-mes-de-agosto-continuamos-realizamos-activity-7232821562280665088-WQTt?utm_source=share&utm_medium=member_desktop"
  }
];

const LinkedInFeed = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex justify-center gap-8 flex-wrap"
    >
      {linkedInPosts.map((post, index) => (
        <motion.div
          key={index}
          variants={fadeInVariant}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 bg-white p-4 w-full max-w-3xl mx-auto"
        >
          <LinkedInEmbed url={post.embedUrl} postUrl={post.postUrl} width="100%" height={570} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LinkedInFeed;
