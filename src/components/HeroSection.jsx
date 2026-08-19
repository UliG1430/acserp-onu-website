import React from "react";
import { motion } from "framer-motion";
import { stagger, cardItem, viewport, ease } from "../utils/motion";

const HeroSection = ({ title = "Nuestra historia", subtitle, image }) => (
  <section className="relative overflow-hidden py-24 text-white">
    {/* Background image */}
    {image && (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    )}
    {/* Overlay */}
    <div
      className="absolute inset-0"
      style={{
        background: image
          ? 'linear-gradient(155deg, rgba(11,21,53,0.82) 0%, rgba(23,37,84,0.78) 55%, rgba(26,32,112,0.75) 100%)'
          : 'linear-gradient(155deg, #0b1535 0%, #172554 55%, #1a2070 100%)',
      }}
    />
    {/* Glow */}
    <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
      style={{ background: 'radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)' }} />

    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      animate="visible"
      className="relative max-w-4xl mx-auto px-6 text-center"
    >
      <motion.h1
        variants={cardItem}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={cardItem}
        className="text-lg sm:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto"
      >
        {subtitle ?? "Más de 9 años contribuyendo a la educación pública, gratuita y de calidad"}
      </motion.p>

      <motion.div
        variants={cardItem}
        className="mt-7 mx-auto w-10 h-0.5 rounded-full bg-white/20"
      />
    </motion.div>
  </section>
);

export default HeroSection;
