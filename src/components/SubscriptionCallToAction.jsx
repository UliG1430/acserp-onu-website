import React from "react";
import { motion } from "framer-motion";
import { stagger, headingVariants, fadeUp, cardItem, viewport } from "../utils/motion";

const SubscriptionCallToAction = () => (
  <section className="relative overflow-hidden py-24 px-6"
    style={{ background: 'linear-gradient(155deg, #0f1535 0%, #172554 50%, #1e1b6e 100%)' }}
  >
    {/* Decorative glows */}
    <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15"
      style={{ background: 'radial-gradient(ellipse, #4f6ef7 0%, transparent 70%)' }} />
    <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
      style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }} />

    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative max-w-2xl mx-auto flex flex-col items-center text-center gap-7"
    >
      {/* Icon */}
      <motion.div
        variants={cardItem}
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
            C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={headingVariants}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight"
      >
        La actividad educativa pública y gratuita más grande de Argentina te necesita
      </motion.h2>

      {/* Body */}
      <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/55 leading-relaxed max-w-lg">
        Con tu aporte mensual acompañás al Modelo ONU más grande del país en su misión de llevar
        educación transformadora a miles de estudiantes cada año.
      </motion.p>

      {/* CTA */}
      <motion.a
        variants={cardItem}
        href="https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03, transition: { duration: 0.22 } }}
        whileTap={{ scale: 0.98 }}
        className="mt-1 inline-flex items-center gap-2 bg-white text-brand-900 font-semibold
          text-sm sm:text-base px-8 py-3.5 rounded-full shadow-brand
          hover:bg-blue-50 transition-colors duration-200"
      >
        Quiero donar
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.a>
    </motion.div>
  </section>
);

export default SubscriptionCallToAction;
