import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { stagger, cardItem, viewport } from "../utils/motion";

const stats = [
  { id: 1, value: 15584, suffix: '+', label: "Participantes totales" },
  { id: 2, value: 131,   suffix: '+', label: "Colegios participantes" },
  { id: 3, value: 156,   suffix: '',  label: "Voluntarios activos" },
  { id: 4, value: 36,    suffix: '',  label: "Modelos realizados" },
];

const StatItem = ({ stat }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <motion.div
      ref={ref}
      variants={cardItem}
      className="flex flex-col items-center px-6 py-10 group
        hover:bg-brand-50 transition-colors duration-300 cursor-default"
    >
      <div className="flex items-end gap-0.5 mb-2">
        <CountUp
          start={0}
          end={inView ? stat.value : 0}
          duration={3.5}
          separator="."
          useEasing
          className="text-4xl lg:text-5xl font-bold text-brand-900 tabular-nums leading-none"
        />
        {stat.suffix && (
          <span className="text-2xl lg:text-3xl font-bold text-brand-600 mb-0.5 leading-none">
            {stat.suffix}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-400 text-center tracking-widest uppercase">
        {stat.label}
      </p>
    </motion.div>
  );
};

const StatsCounter = () => (
  <section className="py-4 bg-white border-b border-gray-100">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100"
      >
        {stats.map((stat) => (
          <StatItem key={stat.id} stat={stat} />
        ))}
      </motion.div>
    </div>
  </section>
);

export default StatsCounter;
