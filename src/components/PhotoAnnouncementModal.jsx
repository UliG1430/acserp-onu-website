import React from "react";
import { safeExternalHref } from "../utils/contentSecurity";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";

const PhotoAnnouncementModal = ({ isOpen, onClose, title, subtitle, buttonUrl }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-blue-950 text-white rounded-2xl shadow-2xl w-[92%] max-w-xl p-10 text-center relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FontAwesomeIcon
              icon={faCameraRetro}
              className="text-5xl mb-6 text-[#a0c4ff]"
            />

            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
              {title}
            </h2>

            <p className="text-blue-200 mb-6 text-base leading-relaxed">
              {subtitle}
            </p>

            {buttonUrl && (
              <a
                href={safeExternalHref(buttonUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#a0c4ff] text-blue-950 font-semibold px-6 py-2.5 rounded-full shadow-md hover:bg-white transition-all duration-300"
              >
                Ir a las fotos
              </a>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-5 text-white hover:text-blue-300 text-xl"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoAnnouncementModal;
