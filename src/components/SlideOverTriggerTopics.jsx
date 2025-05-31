// src/components/SlideOverTriggerTopics.jsx

import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import TopicPanel from "./TopicPanel"; // Componente con los órganos y descargas

const SlideOverTriggerTopics = () => {
  const [open, setOpen] = useState(false);

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

          {/* Panel slide-over */}
          <div className="fixed inset-0 z-50 flex justify-end items-start">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-fit max-w-5xl bg-white shadow-xl rounded-l-xl">
                {/* Botón de cierre */}
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Contenido: Panel de Tópicos */}
                <TopicPanel onClose={() => setOpen(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SlideOverTriggerTopics;
