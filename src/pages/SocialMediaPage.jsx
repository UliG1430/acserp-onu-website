import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaYoutube, FaLinkedin, FaTiktok } from "react-icons/fa";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import InstagramFeed from "../components/InstagramFeed";
import TikTokFeed from "../components/TikTokFeed";
import LinkedInFeed from "../components/LinkedInFeed";
import SEOHelmet from "../components/SEOHelmet";
import { stagger, cardItem, headingVariants, viewport } from "../utils/motion";
import heroImg from "../assets/images/preparatoriosFin2.webp";

/* ── Platform config ────────────────────────────────────────────────────── */
const platforms = [
  {
    id:       "instagram",
    label:    "Instagram",
    handle:   "@modeloonulp",
    url:      "https://www.instagram.com/modeloonulp/?hl=es",
    Icon:     FaInstagram,
    color:    "#E1306C",
    gradient: "from-orange-400 via-pink-500 to-purple-600",
    tabActive:"bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600",
  },
  {
    id:       "tiktok",
    label:    "TikTok",
    handle:   "@modeloonulp",
    url:      "https://www.tiktok.com/@modeloonulp",
    Icon:     FaTiktok,
    color:    "#010101",
    gradient: "from-gray-900 to-black",
    tabActive:"bg-gray-950",
  },
  {
    id:       "linkedin",
    label:    "LinkedIn",
    handle:   "Simulacros Educativos",
    url:      "https://www.linkedin.com/in/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230/",
    Icon:     FaLinkedin,
    color:    "#0A66C2",
    gradient: "from-blue-600 to-blue-700",
    tabActive:"bg-[#0A66C2]",
  },
  {
    id:       "youtube",
    label:    "YouTube",
    handle:   "@modeloonulaplata",
    url:      "https://www.youtube.com/@modeloonulaplata",
    Icon:     FaYoutube,
    color:    "#FF0000",
    gradient: "from-red-500 to-red-700",
    tabActive:"bg-red-600",
  },
];

/* Vídeos de YouTube */
const youtubeVideos = [
  { id: "tF21F8CxBMk", title: "Consejo de Seguridad — Modelo ONU LP" },
  { id: "jYaxIVlTqck", title: "Procedimientos Generales — Modelo ONU LP" },
  { id: "jhtznz0ktmo", title: "Capacitación STI — Modelo ONU LP" },
];

/* ── Feed for YouTube (inline, sin componente aparte) ───────────────────── */
const YouTubeFeed = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {youtubeVideos.map((video) => (
      <motion.div
        key={video.id}
        variants={cardItem}
        className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100
          hover:shadow-xl transition-shadow duration-300"
      >
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-sm font-medium text-gray-700 line-clamp-1">{video.title}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const feedComponents = {
  instagram: <InstagramFeed />,
  tiktok:    <TikTokFeed />,
  linkedin:  <LinkedInFeed />,
  youtube:   <YouTubeFeed />,
};

/* ── Tab content transition ─────────────────────────────────────────────── */
const tabContent = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/* ── Component ──────────────────────────────────────────────────────────── */
const SocialMediaPage = () => {
  const [active, setActive] = useState("instagram");
  const platform = platforms.find((p) => p.id === active);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHelmet
        title="Nuestras Redes Sociales - Modelo ONU La Plata"
        description="Seguinos en nuestras redes sociales para estar al día con todas las novedades del Modelo ONU La Plata."
        url="https://acserp.org.ar/redes"
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
          style={{ background: "linear-gradient(155deg, rgba(11,21,53,0.82) 0%, rgba(23,37,84,0.78) 55%, rgba(26,32,112,0.75) 100%)" }}
        />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2
            w-[700px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)" }}
        />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          {/* Platform icon row */}
          <motion.div variants={cardItem} className="flex justify-center gap-4 mb-8">
            {platforms.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-center w-11 h-11 rounded-2xl
                  bg-gradient-to-br ${p.gradient}`}
              >
                <p.Icon className="w-5 h-5 text-white" />
              </div>
            ))}
          </motion.div>

          <motion.h1
            variants={cardItem}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4"
          >
            Nuestras Redes
          </motion.h1>

          <motion.p
            variants={cardItem}
            className="text-lg text-white/55 leading-relaxed max-w-xl mx-auto"
          >
            Seguinos para estar al día con todas las novedades del Modelo ONU La Plata
          </motion.p>

          <motion.div
            variants={cardItem}
            className="mt-7 mx-auto w-10 h-0.5 rounded-full bg-white/20"
          />
        </motion.div>
      </section>

      {/* ── Platform quick-links ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {platforms.map((p) => (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardItem}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group flex flex-col items-center gap-2.5 p-5 rounded-2xl
                  border border-gray-100 bg-white hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl
                    bg-gradient-to-br ${p.gradient} shadow-sm`}
                >
                  <p.Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.handle}</p>
                </div>
                <ArrowUpRightIcon
                  className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500
                    transition-colors duration-200"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tab navigation + content ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center sm:justify-start">
            {platforms.map((p) => {
              const isActive = active === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                    transition-all duration-250 border
                    ${isActive
                      ? `${p.tabActive} text-white border-transparent shadow-sm`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                    }`}
                >
                  <p.Icon className="w-4 h-4" />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Active platform header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl
                    bg-gradient-to-br ${platform.gradient}`}
                >
                  <platform.Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{platform.label}</h2>
                  <p className="text-sm text-gray-400">{platform.handle}</p>
                </div>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold
                  text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Ver perfil
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={tabContent}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {feedComponents[active]}
            </motion.div>
          </AnimatePresence>

          {/* Mobile "Ver perfil" */}
          <div className="mt-8 flex justify-center sm:hidden">
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
                text-white transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}bb)` }}
            >
              <platform.Icon className="w-4 h-4" />
              Seguir en {platform.label}
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaPage;
