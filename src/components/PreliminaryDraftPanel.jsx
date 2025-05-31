import React, { useState } from "react";
import organsMetadata from "../data/organsMetadata";

const PreliminaryDraftPanel = ({ onClose }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  const sortedOrgans = [...organsMetadata].sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  const handleClick = (org) => {
    if (org.driveLink === "#") {
      setSelectedOrgan(org.nombre);
      setShowAlert(true);
    } else {
      window.open(org.driveLink, "_blank");
    }
  };

  return (
    <div className="h-full w-full bg-white overflow-y-auto p-6">
      <h2 className="text-2xl font-bold text-blue-950 mb-6 text-center">
        Anteproyectos
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedOrgans.map((org) => (
          <button
            key={org.id}
            onClick={() => handleClick(org)}
            className="flex flex-col items-center justify-center rounded-lg p-6 text-white text-center hover:scale-105 transition-transform"
            style={{ backgroundColor: org.color }}
          >
            <img src={org.icon} alt={org.nombre} className="w-16 h-16 mb-3" />
            <span className="text-lg font-semibold">{org.nombre}</span>
          </button>
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

      {/* Modal de aviso elegante */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center animate-fade-in-up">
            <h3 className="text-xl font-semibold text-blue-950 mb-4">Contenido no disponible</h3>
            <p className="text-gray-700 mb-6">
              El anteproyecto para <span className="font-semibold">{selectedOrgan}</span> aún no está disponible. Te invitamos a revisar más adelante.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="px-6 py-2 rounded-full bg-blue-950 text-white hover:bg-blue-800 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreliminaryDraftPanel;