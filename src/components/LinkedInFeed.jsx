import React from "react";
import { LinkedInEmbed } from "react-social-media-embed";
import { motion } from "framer-motion";
import { stagger, cardItem } from "../utils/motion";

const linkedInPosts = [
  {
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7232821551501324290",
    postUrl:  "https://www.linkedin.com/posts/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230_durante-el-mes-de-agosto-continuamos-realizamos-activity-7232821562280665088-WQTt?utm_source=share&utm_medium=member_desktop",
  },
];

const LinkedInFeed = () => (
  <motion.div
    variants={stagger(0.1)}
    initial="hidden"
    animate="visible"
    className="flex justify-center"
  >
    {linkedInPosts.map((post, i) => (
      <motion.div
        key={i}
        variants={cardItem}
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-sm border border-gray-100
          hover:shadow-lg transition-shadow duration-300 bg-white"
      >
        <LinkedInEmbed url={post.embedUrl} postUrl={post.postUrl} width="100%" height={570} />
      </motion.div>
    ))}
  </motion.div>
);

export default LinkedInFeed;
