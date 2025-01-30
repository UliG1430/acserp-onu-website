import React from "react";
import { motion } from "framer-motion";
import InstagramFeed from "../components/InstagramFeed";
import TikTokFeed from "../components/TikTokFeed";
import LinkedInFeed from "../components/LinkedInFeed";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import TikTokLogo from "../assets/logos/tiktok_icon.svg";

// Variantes de animación
const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const SocialMediaPage = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="py-16 bg-gradient-to-b from-blue-100 via-gray-100 to-blue-50 relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-blue-950 text-center mb-12 relative"
        >
          ¡Seguinos en nuestras redes!
          <span className="block w-24 h-1 bg-blue-500 mx-auto mt-3"></span>
        </motion.h1>

        {/* TikTok Section */}
        <motion.div variants={fadeInVariant} className="mb-16 p-8 bg-white shadow-lg rounded-xl">
          <motion.h2 whileHover={{ opacity: 0.8, scale: 1.02 }} transition={{ duration: 0.3 }} className="text-3xl font-bold text-gray-900 flex items-center mb-6 cursor-pointer">
            <img src={TikTokLogo} alt="TikTok" className="w-8 h-8 mr-3" /> TikTok
          </motion.h2>
          <TikTokFeed />
        </motion.div>

        {/* Instagram Section */}
        <motion.div variants={fadeInVariant} className="mb-16 p-8 bg-white shadow-lg rounded-xl">
          <motion.h2 whileHover={{ opacity: 0.8, scale: 1.02 }} transition={{ duration: 0.3 }} className="text-3xl font-bold text-gray-900 flex items-center mb-6 cursor-pointer">
            <FaInstagram className="text-pink-500 mr-3 text-4xl" /> Instagram
          </motion.h2>
          <InstagramFeed />
        </motion.div>

        {/* LinkedIn Section */}
        <motion.div variants={fadeInVariant} className="mb-16 p-8 bg-white shadow-lg rounded-xl">
          <motion.h2 whileHover={{ opacity: 0.8, scale: 1.02 }} transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 flex items-center mb-6 cursor-pointer">
            <FaLinkedin className="text-blue-700 mr-3 text-4xl" /> LinkedIn
          </motion.h2>
          <LinkedInFeed /> 
        </motion.div>

        {/* YouTube Section */}
        <motion.div variants={fadeInVariant} className="p-8 bg-white shadow-lg rounded-xl">
          <motion.h2 whileHover={{ opacity: 0.8, scale: 1.02 }} transition={{ duration: 0.3 }} className="text-3xl font-bold text-gray-900 flex items-center mb-6 cursor-pointer">
            <FaYoutube className="text-red-600 mr-3 text-4xl" /> YouTube
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { id: "tF21F8CxBMk", title: "Consejo de Seguridad - Modelo ONU LP" },
              { id: "jYaxIVlTqck", title: "Procedimientos Generales - Modelo ONU LP" },
              { id: "jhtznz0ktmo", title: "Capacitación STI - Modelo ONU LP" },
            ].map((video, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05, rotate: 1 }} 
                transition={{ duration: 0.3 }} 
                className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300"
              >
                <iframe 
                  src={`https://www.youtube.com/embed/${video.id}`} 
                  title={video.title} 
                  className="w-full h-72 rounded-lg" 
                  allow="autoplay; encrypted-media">
                </iframe>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Botón flotante reutilizable para volver arriba */}
      <ScrollToTopButton />
    </motion.section>
  );
};

export default SocialMediaPage;
