// src/pages/DonationsPage.jsx
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import SEOHelmet from "../components/SEOHelmet";
import heroDonaciones from "../assets/images/image3.webp";
import { useSiteContent } from "../context/SiteContentContext";

const DonationsPage = () => {
  const { content } = useSiteContent();
  const donations = content.donations;
  const allocationItems = (donations.allocationItems || []).filter((item) => !item.hidden);
  const faqItems = (donations.faqs || []).filter((item) => !item.hidden);
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
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroDonaciones}
            alt="Donaciones ONU Modelo"
            loading="lazy"
            className="w-full h-full object-cover object-[center_45%] md:object-[center_58%] opacity-0"
            style={{ animation: "zoomEffect 10s ease-in-out infinite alternate, fadeIn 1s ease-out forwards" }}
          />
          <div
            className="absolute inset-0 pointer-events-none bg-white animate-fade-out-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/65 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 animate-fade-in-slow">
            {donations.heroTitle}
          </h1>
          <p
            className="text-blue-200 text-xs md:text-sm uppercase tracking-[0.14em] mb-3 opacity-0 animate-fade-in"
            style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
          >
            {donations.heroKicker}
          </p>
          <a
            href={donations.heroButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-blue-950 font-extrabold text-xl md:text-2xl px-12 md:px-16 py-4 md:py-5 rounded-full shadow-2xl ring-1 ring-blue-200/70 hover:shadow-[0_20px_45px_rgba(12,24,72,0.45)] hover:-translate-y-0.5 hover:bg-slate-50 transition-all duration-300 whitespace-nowrap tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white opacity-0 animate-fade-in"
            style={{ animationDelay: "260ms", animationFillMode: "forwards" }}
          >
            {donations.heroButtonText}
          </a>
          <p
            className="text-blue-200/85 text-xs mt-2 opacity-0 animate-fade-in"
            style={{ animationDelay: "420ms", animationFillMode: "forwards" }}
          >
            {donations.securePaymentText}
          </p>
        </div>
      </div>

      {/* Por qué donar */}
      <div
        ref={whyDonateRef}
        className={`max-w-5xl mx-auto px-4 pt-16 pb-12 text-center transition-all duration-700 ease-out ${
          whyDonateInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{donations.whyTitle}</h2>
        <p className="text-lg md:text-xl text-blue-200/85 leading-relaxed max-w-4xl mx-auto">
          {donations.whyText}
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
              <h3 className="text-2xl md:text-3xl font-bold mb-5">{donations.allocationTitle}</h3>
              <div className="space-y-4">
                {allocationItems.map((item) => (
                  <div key={item.id || item.title} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <p className="text-blue-200/85">
                      <span className="text-white font-semibold">{item.title}:</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={impactRef}
              className={`transition-all duration-700 ease-out ${
                impactInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white/10 rounded-2xl border border-blue-500/40 p-6">
                <p className="text-blue-200 text-xs uppercase tracking-[0.16em] mb-3">{donations.impactKicker}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-extrabold text-white">{donations.impactNumber}</p>
                    <p className="text-blue-200/85">{donations.impactNumberText}</p>
                  </div>
                  <div className="h-px bg-blue-300/30" />
                  <div>
                    <p className="text-2xl font-bold text-white">{donations.impactTitle}</p>
                    <p className="text-blue-200/85">{donations.impactText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/30 text-center">
            <p className="text-blue-200/85 italic max-w-3xl mx-auto">
              "{donations.quote}"
            </p>
            <p className="text-white font-semibold mt-3">{donations.quoteAuthor}</p>
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
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">{donations.faqTitle}</h3>
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
