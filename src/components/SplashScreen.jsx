import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti-boom";
import logo from "../assets/logos/blank_logos/logo_white.png";

const SplashScreen = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 bg-blue-950 text-white z-50 flex flex-col items-center justify-center px-4 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={logo}
            alt="Modelo ONU"
            className="w-36 md:w-44 h-auto mb-6 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-center leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            ¡Bienvenidos a nuestra nueva página web!
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-blue-200 mt-4 font-light tracking-wide italic max-w-xs sm:max-w-md md:max-w-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Asociación Civil Simulacros Educativos Río de La Plata
          </motion.p>

          <Confetti
            mode="boom"
            particleCount={80}
            colors={["#FFFFFF", "#A0C4FF", "#787AC1"]}
            effectCount={1}
            effectInterval={3000}
            fadeOutHeight={0.8}
            launchSpeed={1}
            spreadDeg={60}
            shapeSize={8}
            opacityDeltaMultiplier={1}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;