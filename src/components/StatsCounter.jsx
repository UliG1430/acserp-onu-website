import React from "react";
import CountUp from "react-countup";

const StatsCounter = () => {
  const stats = [
    { id: 1, value: 15584, label: "TOTAL DE PARTICIPANTES" },
    { id: 2, value: 131, label: "COLEGIOS QUE PARTICIPARON" },
    { id: 3, value: 156, label: "VOLUNTARIOS ACTUALMENTE" },
    { id: 4, value: 36, label: "MODELOS REALIZADOS" },
  ];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
