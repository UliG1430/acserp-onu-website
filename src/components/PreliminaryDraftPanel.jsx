import React from "react";
import organsMetadata from "../data/organsMetadata";

const PreliminaryDraftPanel = ({ onClose }) => {
  // Ordenar alfabéticamente por nombre
  const sortedOrgans = [...organsMetadata].sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  return (
    <div className="h-full w-full bg-white overflow-y-auto p-6">
      <h2 className="text-2xl font-bold text-blue-950 mb-6 text-center">
        Anteproyectos
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedOrgans.map((org) => (
          <a
            key={org.id}
            href={org.driveLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-lg p-6 text-white text-center hover:scale-105 transition-transform"
            style={{ backgroundColor: org.color }}
          >
            <img src={org.icon} alt={org.nombre} className="w-16 h-16 mb-3" />
            <span className="text-lg font-semibold">{org.nombre}</span>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:underline"
        >
          Cerrar panel
        </button>
      </div>
    </div>
  );
};

export default PreliminaryDraftPanel;
