import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VerticalCarousel from '../components/VerticalCarousel';
import SEOHelmet from '../components/SEOHelmet';
import { stagger, cardItem, headingVariants, viewport } from '../utils/motion';
import heroImg from '../assets/images/apertura1.webp';

const driveLinks = [
  {
    label: 'Galería completa — VII Edición',
    desc:  'Apertura, sesiones y agasajo diplomático',
    href:  'https://drive.google.com/drive/folders/1lUwofFDsJk68XDpKdA-3HrZAPSjKmOa6',
  },
  {
    label: 'Preparatorios 2025',
    desc:  'Jornadas preparatorias en sedes emblemáticas',
    href:  'https://drive.google.com/drive/folders/1-1_qQ-c_0ZBps9Sf1Fw-R_W7aDHM0hfr',
  },
];

const Photos = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Galería de Fotos - Modelo ONU La Plata"
        description="Explorá los momentos destacados de nuestros simulacros educativos en la galería de fotos del Modelo ONU La Plata."
        url="https://acserp.org.ar/fotos"
        image="https://acserp.org.ar/og-image.png"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 text-white">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(155deg, rgba(11,21,53,0.82) 0%, rgba(23,37,84,0.78) 55%, rgba(26,32,112,0.75) 100%)' }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)' }} />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={cardItem}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <PhotoIcon className="w-7 h-7 text-blue-300" />
          </motion.div>

          <motion.h1
            variants={cardItem}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
          >
            Galería de Fotos
          </motion.h1>

          <motion.p
            variants={cardItem}
            className="text-lg text-white/55 leading-relaxed max-w-xl mx-auto"
          >
            Momentos destacados de nuestros simulacros educativos
          </motion.p>

          <motion.div
            variants={cardItem}
            className="mt-7 mx-auto w-10 h-0.5 rounded-full bg-white/20"
          />
        </motion.div>
      </section>

      {/* ── Photo sections ── */}
      <VerticalCarousel />

      {/* ── Drive section ── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
              Archivo completo
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Accedé a todas las fotos
            </h2>
            <p className="text-base text-gray-500 max-w-md mx-auto">
              Las galerías completas están disponibles en Google Drive, organizadas por edición y evento.
            </p>
          </motion.div>

          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 gap-4"
          >
            {driveLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className="group flex items-center gap-5 p-6 rounded-2xl border border-gray-100
                  bg-white shadow-sm hover:shadow-brand transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl
                  bg-brand-50 text-brand-700 shrink-0 group-hover:bg-brand-100 transition-colors duration-200">
                  <FontAwesomeIcon icon={faGoogleDrive} className="text-xl" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>

                <ArrowUpRightIcon className="w-4 h-4 text-gray-300 group-hover:text-brand-600
                  transition-colors duration-200 shrink-0" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Photos;
