import React from 'react';
import { useInView } from 'react-intersection-observer';
import SEOHelmet from '../components/SEOHelmet';
import { useSiteContent } from '../context/SiteContentContext';

const OrganCard = ({ organ, index, topicEdition }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const isEven = index % 2 === 0;
  const organColor = organ.color || "#3B82F6";
  const [fallbackTopicTitle = "", ...fallbackTopicSubtitleLines] = String(organ.topicText || "").split(/\r?\n/);
  const topicTitle = organ.topicTitle ?? fallbackTopicTitle.trim();
  const topicSubtitle = organ.topicSubtitle ?? fallbackTopicSubtitleLines.join("\n").trim();
  const hasTopicLink = organ.topicLink && organ.topicLink !== "#";
  const openTopicLink = () => {
    if (hasTopicLink) window.open(organ.topicLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={ref}
      className={`mb-16 last:mb-0 ${
        inView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } transition-all duration-1000 ease-out`}
    >
      <div className={`
        relative overflow-hidden rounded-2xl shadow-2xl
        ${isEven ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}
        border border-gray-100
        transform transition-all duration-500 ease-out
        hover:scale-[1.02] hover:shadow-3xl hover:-translate-y-2
        group cursor-pointer
      `}>
        <div
          className="absolute top-0 left-0 w-full h-1 transition-all duration-500 ease-out group-hover:h-2 group-hover:animate-pulse"
          style={{ backgroundColor: organColor }}
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none">
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            style={{ background: `linear-gradient(90deg, transparent, ${organColor}20, transparent)` }}
          />
        </div>

        <div className={`
          flex flex-col lg:flex-row items-center p-8 lg:p-12
          ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}
        `}>
          <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {organ.logoUrl ? (
                  <img
                    src={organ.logoUrl}
                    alt={organ.name}
                    className="object-contain w-80 h-40 lg:w-[500px] lg:h-[250px]"
                  />
                ) : (
                  <div className="flex h-40 w-80 items-center justify-center text-gray-400 lg:h-[250px] lg:w-[500px]">
                    Sin logo
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:px-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-500 ease-out group-hover:scale-105 group-hover:translate-x-2">
                {organ.shortName || organ.name}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {organ.description}
              </p>

              <button
                type="button"
                onClick={openTopicLink}
                disabled={!hasTopicLink}
                className={`w-full p-4 rounded-r-lg mb-6 border-l-4 text-left transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:border-l-8 ${
                  hasTopicLink
                    ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    : "cursor-default"
                }`}
                style={{
                  backgroundColor: organColor === "#000000" ? "rgba(0, 0, 0, 0.1)" : `${organColor}15`,
                  borderLeftColor: organColor,
                  outlineColor: organColor,
                }}
                aria-label={hasTopicLink ? `Abrir tópico ampliado de ${organ.name}` : undefined}
              >
                <h3 className="text-lg font-semibold mb-2" style={{ color: organColor }}>
                  Tópico - {topicEdition}
                </h3>
                {topicTitle && (
                  <p className="whitespace-pre-line text-xl font-semibold leading-snug text-gray-800">
                    {topicTitle}
                  </p>
                )}
                {topicSubtitle && (
                  <p
                    className="mt-3 whitespace-pre-line border-t pt-3 text-base leading-relaxed text-gray-700"
                    style={{ borderTopColor: `${organColor}40` }}
                  >
                    {topicSubtitle}
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Model = () => {
  const { content } = useSiteContent();
  const visibleOrgans = content.organs.filter((organ) => !organ.hidden);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SEOHelmet 
        title="Órganos - Modelo ONU La Plata"
        description="Explorá los órganos y comités del Modelo ONU La Plata, donde los estudiantes debaten y resuelven problemas globales."
      />

      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-24 w-full overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight">
              Órganos
            </h1>
            {content.modelPage.subtitle && (
              <p className="text-2xl md:text-3xl font-semibold text-blue-200 mb-6">
                {content.modelPage.subtitle}
              </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl font-light leading-relaxed text-blue-100 max-w-4xl mx-auto">
            {content.modelPage.intro}
          </p>
          

        </div>
      </section>

      {/* Órganos Grid Mejorado */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {visibleOrgans.map((organ, index) => (
            <OrganCard
              key={organ.id}
              organ={organ}
              index={index}
              topicEdition={content.modelPage.topicEdition || "VIII Edición"}
            />
          ))}
        </div>
      </section>

     
    </div>
  );
};

export default Model;
