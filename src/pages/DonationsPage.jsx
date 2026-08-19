// src/pages/DonationsPage.jsx
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SEOHelmet from "../components/SEOHelmet";
import { stagger, cardItem } from "../utils/motion";
import heroImg from "../assets/images/acserp4.webp";
import { trackEvent } from "../utils/pixel";

const DONATION_URL =
  "https://donaronline.org/simulacros-educativos-rio-de-la-plata/la-actividad-educativa-publica-y-gratuita-mas-grande-de-argentina-te-necesita";

const faqItems = [
  {
    question: "¿La donación es segura?",
    answer:
      "Sí. El pago se realiza a través de DonarOnline en una plataforma segura con procesamiento cifrado.",
  },
  {
    question: "¿Puedo donar una sola vez?",
    answer:
      "Sí. Podés realizar un aporte puntual sin compromiso de continuidad.",
  },
  {
    question: "¿Puedo modificar o detener mis aportes?",
    answer:
      "Sí. Podes modificar o cancelar tus aportes en cualquier momento mandando un correo a modeloonulp@gmail.com",
  },
  {
    question: "¿A qué se destina mi aporte?",
    answer:
      "Se destina a sostener nuestras actividades durante todo el año: logística, materiales pedagógicos, recursos para delegaciones y funcionamiento general del programa.",
  },
];

const DonationsPage = () => {
  const [openFaqIndexes, setOpenFaqIndexes] = useState([]);

  const { ref: whyDonateRef, inView: whyDonateInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: trustRef, inView: trustInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: impactRef, inView: impactInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: faqRef, inView: faqInView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const toggleFaq = (index) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  return (
    <section className="bg-blue-950 text-white min-h-screen">
      <SEOHelmet
        title="Donaciones - Modelo ONU La Plata"
        description="Contribuí al Modelo ONU La Plata y apoyá la educación pública y gratuita con tu donación."
      />

      {/* Hero */}
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
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)' }}
        />
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <motion.p
            variants={cardItem}
            className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4"
          >
            Donaciones • ACSERP
          </motion.p>
          <motion.h1
            variants={cardItem}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8"
          >
            ¡Hacé tu aporte al Modelo ONU más grande del país!
          </motion.h1>
          <motion.div variants={cardItem} className="flex flex-col items-center gap-3">
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("InitiateCheckout", { content_name: "Donación ACSERP" })}
              className="inline-flex items-center justify-center bg-white text-blue-950 font-extrabold text-xl px-12 py-4 rounded-full shadow-2xl ring-1 ring-blue-200/70 hover:shadow-[0_20px_45px_rgba(12,24,72,0.45)] hover:-translate-y-0.5 hover:bg-slate-50 transition-all duration-300 whitespace-nowrap tracking-tight"
            >
              Quiero aportar
            </a>
            <p className="text-blue-300/80 text-xs">Pago seguro • DonarOnline</p>
          </motion.div>
          <motion.div variants={cardItem} className="mt-8 mx-auto w-10 h-0.5 rounded-full bg-white/20" />
        </motion.div>
      </section>

      {/* Por qué donar */}
      <div
        ref={whyDonateRef}
        className={`max-w-5xl mx-auto px-4 pt-16 pb-12 text-center transition-all duration-700 ease-out ${
          whyDonateInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">¿Por qué donar?</h2>
        <p className="text-lg md:text-xl text-blue-200/85 leading-relaxed max-w-4xl mx-auto">
          Tu colaboración hace posible que miles de estudiantes de escuelas públicas y privadas de toda la región vivan
          una experiencia educativa transformadora. Cada donación sostiene un proyecto colectivo basado en compromiso
          voluntario, participación juvenil y cooperación internacional.
        </p>
      </div>

      {/* Valor e impacto */}
      <div
        ref={trustRef}
        className={`max-w-6xl mx-auto px-4 pb-12 transition-all duration-700 ease-out ${
          trustInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="rounded-2xl bg-gradient-to-br from-blue-900/80 to-blue-800/60 border border-blue-700/70 p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-5">¿A dónde va tu aporte?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-blue-200/85">
                    <span className="text-white font-semibold">Logística educativa:</span> organización de actividades,
                    espacios y recursos operativos.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-blue-200/85">
                    <span className="text-white font-semibold">Materiales:</span> documentación pedagógica y herramientas
                    para delegaciones.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-blue-200/85">
                    <span className="text-white font-semibold">Sostenimiento anual:</span> continuidad del proyecto
                    público y gratuito más grande de Argentina.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={impactRef}
              className={`transition-all duration-700 ease-out ${
                impactInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white/10 rounded-2xl border border-blue-500/40 p-6">
                <p className="text-blue-200 text-xs uppercase tracking-[0.16em] mb-3">Impacto del proyecto</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-extrabold text-white">+4000</p>
                    <p className="text-blue-200/85">jóvenes participantes por ciclo</p>
                  </div>
                  <div className="h-px bg-blue-300/30" />
                  <div>
                    <p className="text-2xl font-bold text-white">Educación pública con impacto real</p>
                    <p className="text-blue-200/85">tu aporte fortalece una experiencia transformadora para miles de jóvenes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/30 text-center">
            <p className="text-blue-200/85 italic max-w-3xl mx-auto">
              "Donar es apostar a una experiencia que cambia trayectorias educativas y abre oportunidades reales para
              miles de jóvenes."
            </p>
            <p className="text-white font-semibold mt-3">Equipo ACSERP</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div
        ref={faqRef}
        className={`max-w-4xl mx-auto px-4 py-14 transition-all duration-700 ease-out ${
          faqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">Preguntas frecuentes</h3>
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndexes.includes(index);

            return (
              <div
                key={item.question}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-cyan-300/50 bg-blue-800/70 shadow-lg shadow-cyan-900/20"
                    : "border-blue-700 bg-blue-900/60"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 py-4 font-semibold flex items-center justify-between hover:bg-blue-800/60 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span
                    className={`ml-4 text-2xl leading-none transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`px-5 pb-4 text-blue-200/85 text-sm md:text-base transition-all duration-300 ${
                        isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DonationsPage;
