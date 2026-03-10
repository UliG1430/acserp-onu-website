import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatsCounter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  const stats = [
    { id: 1, value: 15584, label: "TOTAL DE PARTICIPANTES" },
    { id: 2, value: 131, label: "COLEGIOS QUE PARTICIPARON" },
    { id: 3, value: 156, label: "VOLUNTARIOS ACTUALMENTE" },
    { id: 4, value: 36, label: "MODELOS REALIZADOS" },
  ];

  return (
    <div className="py-10 bg-gray-50">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center transition-all duration-[1400ms] ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="group flex flex-col items-center transform transition duration-500 hover:scale-105 hover:text-blue-600"
          >
            <CountUp
              start={0}
              end={stat.value}
              duration={5.5}
              separator=""
              className="text-4xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-500"
            />
            <p className="text-lg font-medium text-gray-500 mt-2 group-hover:text-blue-600 transition-colors duration-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;
