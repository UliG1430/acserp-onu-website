import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { driveConfig } from '../config/driveConfig';
import { stagger, cardItem, headingVariants, viewport } from '../utils/motion';

import libertyTimesLogo from '../assets/logos/liberty_times.png';
import onuTodayLogo     from '../assets/logos/onu_today.png';
import voceroDelSurLogo from '../assets/logos/vocero_del_sur_png.png';

const logoMap = {
  'Liberty Times':  libertyTimesLogo,
  'ONU Today':      onuTodayLogo,
  'Vocero del Sur': voceroDelSurLogo,
};

const DrivePreviewSimple = () => {
  const newspapers = driveConfig.newspapers;

  return (
    /* Deep navy background — white logos become fully visible */
    <section
      data-section="diarios"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #070d20 0%, #0c1535 60%, #111a45 100%)' }}
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">
            Publicaciones oficiales
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Diarios del Modelo ONU
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Accedé a las ediciones publicadas durante cada período de sesiones
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newspapers.map((newspaper) => (
            <motion.a
              key={newspaper.name}
              href={newspaper.folderId}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardItem}
              whileHover={{ y: -6, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
              className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              aria-label={`Acceder a ${newspaper.name}`}
            >
              {/* Glass shine on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)',
                }} />

              {/* Logo area */}
              <div className="flex items-center justify-center h-48 px-10 py-8">
                <img
                  src={logoMap[newspaper.name]}
                  alt={`Logo ${newspaper.name}`}
                  className="max-h-full max-w-[200px] w-full object-contain
                    group-hover:scale-105 transition-transform duration-400"
                  style={{ filter: 'drop-shadow(0 2px 12px rgba(255,255,255,0.08))' }}
                />
              </div>

              {/* Divider */}
              <div className="mx-6 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-white/90">{newspaper.name}</p>
                  {newspaper.description && (
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{newspaper.description}</p>
                  )}
                </div>
                <span className="flex items-center justify-center w-8 h-8 rounded-full
                  bg-white/8 border border-white/12 text-white/50 group-hover:text-white
                  group-hover:bg-white/15 transition-all duration-200 shrink-0 ml-3">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DrivePreviewSimple;
