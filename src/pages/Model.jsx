import React from 'react';
import { motion } from 'framer-motion';
import { bodies } from '../data/bodies';
import { useInView } from 'react-intersection-observer';
import SEOHelmet from '../components/SEOHelmet';
import organsMetadata from '../data/organsMetadata';
import { fadeLeft, fadeRight, headingVariants, stagger, cardItem, viewport, ease } from '../utils/motion';

const ID_MAP = {
  13: "STI",  2: "AG",  6: "CS",  7: "ECOSOC", 4: "CDH",
  11: "ONUM", 12: "PNUMA", 14: "UNESCO", 1: "ACNUR",
  15: "UNICEF", 9: "OMS", 3: "CAJ", 8: "OIT",
  10: "ONUDD", 5: "UNODA",
};

const TOPICS = {
  13: "EJE 1: Nuevas agendas de seguridad; EJE 2: Hegemonía económica mundial en disputa",
  2:  "Inteligencia artificial en procesos electorales. Desafíos globales de regulación, privacidad y equidad en campañas políticas",
  6:  "Crisis en la región de Cachemira. Conflicto territorial y las consecuencias de su escalada",
  7:  "Sostenibilidad de la deuda pública. Retos para el desarrollo, la autonomía fiscal y la estabilidad económica global",
  4:  "Militarización de las fuerzas de seguridad. Del ejercicio legítimo de la violencia al abuso de poder",
  11: "Economía de la fertilidad y gestación subrogada. Dilemas éticos y jurídicos sobre la instrumentalización de la mujer",
  12: "Políticas verdes o desarrollo: ¿una falsa dicotomía? Tensión entre la responsabilidad histórica del norte y los desafíos del sur global",
  14: "Lenguas silenciadas. La herencia de la colonización, la globalización y la exclusión lingüística",
  1:  "Derecho al retorno. Obstáculos políticos, sociales y jurídicos para su implementación",
  15: "Trata con fines de explotación. La infancia en peligro: desafíos transnacionales para la protección de los derechos de niñas y niños",
  9:  "Regulación de la edición genética. Entre los fines terapéuticos y las ambiciones eugenésicas",
  3:  "Crímenes de lesa humanidad. Debate jurídico y avance del negacionismo internacional",
  8:  "La reconfiguración del trabajo en la era de las plataformas. Tensiones entre flexibilidad, regulación y derechos laborales",
  10: "Corrupción estatal. Crimen transnacional, lavado de activos y vacíos legales en la regulación internacional",
  5:  "Producción, trazabilidad y uso de las armas. El rol de los Estados en la plena vigencia de los acuerdos internacionales existentes",
};

const getOrganColor = (bodyId) => {
  const organ = organsMetadata.find((o) => o.id === ID_MAP[bodyId]);
  return organ?.color ?? "#3B82F6";
};

const BodyCard = ({ body, index }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "-5% 0px" });
  const isEven = index % 2 === 0;
  const color  = getOrganColor(body.id);
  const textAnim = isEven ? fadeLeft : fadeRight;
  const imgAnim  = isEven ? fadeRight : fadeLeft;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.6, ease }}
        className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm
          hover:shadow-brand transition-shadow duration-400 group"
      >
        {/* Top accent */}
        <div
          className="absolute top-0 inset-x-0 h-0.5 group-hover:h-1 transition-all duration-300"
          style={{ backgroundColor: color }}
        />

        <div className={`flex flex-col lg:flex-row items-center gap-10 p-8 lg:p-12
          ${!isEven ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Logo */}
          <motion.div
            initial={imgAnim.hidden}
            animate={inView ? imgAnim.visible : imgAnim.hidden}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="lg:w-2/5 flex justify-center shrink-0"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full max-w-xs">
              <img
                src={body.logo}
                alt={body.nombre}
                className="w-full h-28 lg:h-40 object-contain"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={textAnim.hidden}
            animate={inView ? textAnim.visible : textAnim.hidden}
            transition={{ duration: 0.6, ease }}
            className="lg:w-3/5 text-center lg:text-left space-y-4"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {body.nombre}
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              {body.descripcion}
            </p>
            {TOPICS[body.id] && (
              <div
                className="rounded-r-xl p-4 border-l-4 text-sm"
                style={{
                  backgroundColor: color === "#000000" ? "rgba(0,0,0,0.05)" : `${color}12`,
                  borderLeftColor: color,
                }}
              >
                <p className="font-semibold mb-1 text-xs uppercase tracking-wide" style={{ color }}>
                  Tópico — VIII Edición
                </p>
                <p className="text-gray-600 leading-relaxed">{TOPICS[body.id]}</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Model = () => (
  <div className="min-h-screen bg-gray-50">
    <SEOHelmet
      title="Órganos - Modelo ONU La Plata"
      description="Explorá los órganos y comités del Modelo ONU La Plata, donde los estudiantes debaten y resuelven problemas globales."
    />

    {/* Hero */}
    <section
      className="relative overflow-hidden py-24 text-white"
      style={{ background: 'linear-gradient(155deg, #0b1535 0%, #172554 55%, #1a2070 100%)' }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(ellipse, #3b5bdb 0%, transparent 70%)' }} />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto px-6 text-center"
      >
        <motion.h1 variants={cardItem}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
          Órganos
        </motion.h1>
        <motion.div variants={cardItem} className="w-10 h-0.5 bg-white/20 rounded-full mx-auto mb-6" />
        <motion.p variants={cardItem}
          className="text-lg sm:text-xl text-white/55 max-w-3xl mx-auto leading-relaxed">
          Conocé todos los órganos que formaron parte de los{' '}
          <span className="font-semibold text-white/80">Modelos Intercolegiales de Naciones Unidas</span>{' '}
          en La Plata. A lo largo de los años, nuestra Asociación ha desarrollado una amplia variedad
          de órganos y comités, permitiendo a los y las participantes abordar las principales
          temáticas de la agenda internacional desde distintas perspectivas.
        </motion.p>
      </motion.div>
    </section>

    {/* Bodies */}
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {bodies.map((body, index) => (
          <BodyCard key={body.id} body={body} index={index} />
        ))}
      </div>
    </section>
  </div>
);

export default Model;
