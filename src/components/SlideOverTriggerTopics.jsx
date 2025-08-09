// src/components/SlideOverTriggerTopics.jsx

import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import organsMetadata from "../data/organsMetadata";

const SlideOverTriggerTopics = () => {
  const [open, setOpen] = useState(false);

  // Filtrar órganos que tienen topicLink
  const availableTopics = organsMetadata.filter(organ => organ.topicLink && organ.topicLink !== "#");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-block px-4 py-2 text-sm font-medium bg-[#787ac1] text-white rounded-md hover:bg-blue-950 transition"
      >
        Ver tópicos
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          {/* Fondo oscuro */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/* Panel slide-over - Full height */}
          <div className="fixed inset-0 z-50 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-full max-w-6xl bg-white shadow-xl flex flex-col h-full">
                {/* Header con botón de cierre */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold text-blue-950">Tópicos Ampliados Internos 2025</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="h-8 w-8" />
                  </button>
                </div>

                {/* Contenido: Panel de Tópicos - Full height */}
                <div className="flex-1 overflow-y-auto p-6">
                  {availableTopics.length > 0 ? (
                    <div className="h-full flex flex-col">
                      {/* Grid de logos - 3 filas de 5 logos */}
                      <div className="flex-1 grid grid-cols-5 gap-6 content-center">
                        {availableTopics.map((organ) => (
                          <button
                            key={organ.id}
                            onClick={() => window.open(organ.topicLink, "_blank")}
                            className="rounded-xl flex flex-col justify-center items-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 py-8 px-4 min-h-[160px]"
                            style={{ backgroundColor: organ.color }}
                          >
                            <img
                              src={organ.icon}
                              alt={organ.nombre}
                              className="w-16 h-16 mb-4 object-contain"
                            />
                            <span className="text-white text-center font-semibold text-sm leading-tight">
                              {organ.nombre}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Footer informativo */}
                      <div className="mt-8 text-center text-gray-600 text-sm">
                        <p>Hacé clic en cualquier órgano para descargar su tópico ampliado</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                          <InformationCircleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Los tópicos ampliados aún no están disponibles.
                        </p>
                        
                        <p className="text-sm text-gray-600 mb-6">
                          ¡Estate atento a nuestras redes sociales para enterarte cuando estén listos!
                        </p>
                        
                        <button
                          onClick={() => setOpen(false)}
                          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          ¡Perfecto, gracias!
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SlideOverTriggerTopics;
