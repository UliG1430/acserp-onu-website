import React from "react";
import organsMetadata from "../data/organsMetadata";

const TopicPanel = ({ onClose }) => {
  // Filtra solo órganos con topicLink válido
  const filteredOrgans = organsMetadata.filter(org => org.topicLink && org.topicLink !== "#");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-950 mb-8 text-center">Tópicos Ampliados Internos 2025</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredOrgans.map((organ) => (
          <button
            key={organ.id}
            onClick={() => window.open(organ.topicLink, "_blank")}
            className="rounded-xl flex flex-col justify-center items-center shadow-md hover:shadow-xl transition-transform hover:scale-105 py-6 px-4"
            style={{ backgroundColor: organ.color }}
          >
            <img
              src={organ.icon}
              alt={organ.nombre}
              className="w-14 h-14 mb-3 object-contain"
            />
            <span className="text-white text-center font-semibold text-sm leading-tight">
              {organ.nombre}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicPanel;
