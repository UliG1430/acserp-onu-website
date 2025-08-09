import React from "react";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import SEOHelmet from "../components/SEOHelmet";
import recursoBanner from "../assets/images/image1.webp";
import SlideOverTrigger from "../components/SlideOverTrigger";
import SlideOverTriggerTopics from "../components/SlideOverTriggerTopics";
import { motion } from "framer-motion";

const Resources = () => {
  const { ref: driveRef, inView: driveInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const reglamentoLink ='https://drive.google.com/uc?export=download&id=1J4SGK_Hq3XaTIT6hRcjWUTRsRppTHYAi'
  const driveLink =
    "https://drive.google.com/drive/folders/1bDQ4vE3yD-5RqmBd1Tgqf-9WFKy4WEML";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <SEOHelmet
        title="Recursos - Modelo ONU La Plata"
        description="Accedé a los recursos y materiales educativos del Modelo ONU La Plata para delegados, docentes y organizadores."
        url="https://acserp.org.ar/recursos"
        image="https://acserp.org.ar/og-image.png"
      />

      {/* Hero */}
      <div className="relative w-full h-[400px] shadow-md overflow-hidden">
        <img
          src={recursoBanner}
          alt="Recursos Modelo ONU"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex items-center justify-center">
          <div className="text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md"
            >
              Recursos Académicos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="text-lg md:text-xl font-semibold text-[#a0c4ff] drop-shadow-md tracking-wide max-w-2xl mx-auto mt-4"
            >
              Guías, documentos, reglamentos y materiales clave para vivir la experiencia Modelo ONU.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Intro - con fondo más claro */}
      <section className="bg-gray-100 py-16 w-full">
        <div className="w-full text-center text-blue-950">
          <p className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm max-w-7xl mx-auto px-4">
            En este espacio vas a encontrar todos los documentos necesarios para participar del Modelo de Naciones Unidas. Desde el reglamento oficial hasta los anteproyectos y tópicos ampliados.
          </p>
        </div>
      </section>

      {/* Cards con fondo profesional oscuro */}
      <section
        ref={driveRef}
        className={`transition-opacity duration-1000 ease-in-out px-6 py-20 w-full bg-gradient-to-br from-[#0a1a3b] via-[#1c1d5e] to-[#2c2e8c] ${
          driveInView ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {/* Reglamento */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105">
            <FontAwesomeIcon
              icon={faFileAlt}
              className="text-yellow-500 text-4xl mb-4"
            />
            <h3 className="text-lg font-bold mb-2 text-blue-900">
              Reglamento Modelo ONU
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Descargá el reglamento oficial con toda la normativa y protocolos.
            </p>
            <a
              href={reglamentoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
            >
              Descargar reglamento
            </a>
          </div>

          {/* Países por Órgano */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-start justify-between">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="text-pink-500 text-4xl mb-4"
            />
            <h3 className="text-lg font-bold mb-2 text-blue-900">
              Países por Órgano
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Consultá qué países representan cada delegación en cada órgano.
            </p>
            <a
              href="https://drive.google.com/file/d/17CcIvdx5EwdCgbj71OpoEiCdSC9OXWcb/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
            >
              Ver países por órgano
            </a>
          </div>

          {/* Tópicos Ampliados */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-start justify-between">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="text-indigo-400 text-4xl mb-4"
            />
            <h3 className="text-lg font-bold mb-2 text-blue-900">
              Tópicos Ampliados
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Explorá los temas desarrollados de cada comité y descargalos.
            </p>
            <SlideOverTriggerTopics />
          </div>
        </div>

        {/* Acceso al Drive general */}
        <div className="mt-20 text-center">
          <motion.a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="inline-block bg-white text-blue-950 px-10 py-4 text-lg rounded-full font-semibold shadow-md hover:bg-blue-100 transition-all duration-300"
          >
            Accedé al Drive para encontrar todo el contenido
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default Resources;
