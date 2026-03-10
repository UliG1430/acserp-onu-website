import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";

const HIDE_UNTIL_KEY = "donationPopupHideUntil";
const HIDE_HOURS = 24;
const SHOW_DELAY_MS = 4000;

const DonationHomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isDonationPage = location.pathname.startsWith("/donar");

  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 70, damping: 24, mass: 0.8 });
  const scrollYOffset = useTransform(smoothScroll, [0, 1800], [0, -14]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    // On every route change, reset visibility so it does not stay open across pages.
    setIsVisible(false);

    if (isDonationPage) {
      return undefined;
    }

    const params = new URLSearchParams(window.location.search);
    const isForcedOpen = params.get("popup") === "1";

    if (isForcedOpen) {
      const forcedTimer = setTimeout(() => setIsVisible(true), 250);
      return () => clearTimeout(forcedTimer);
    }

    const hideUntil = Number(localStorage.getItem(HIDE_UNTIL_KEY) || 0);
    const shouldHide = Date.now() < hideUntil;

    if (shouldHide) return undefined;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search, isDonationPage]);

  const closePopup = () => setIsVisible(false);

  const hidePopupFor24Hours = () => {
    const hideUntil = Date.now() + HIDE_HOURS * 60 * 60 * 1000;
    localStorage.setItem(HIDE_UNTIL_KEY, String(hideUntil));
    closePopup();
  };

  if (isDonationPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.985 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: scrollYOffset }}
          className="fixed z-50 bottom-4 right-4 w-[calc(100%-2rem)] max-w-md bg-white text-blue-950 rounded-3xl shadow-2xl border border-blue-100 ring-1 ring-slate-100 p-6"
          role="dialog"
          aria-label="Invitacion a donar"
        >
          <button
            type="button"
            onClick={closePopup}
            className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
            aria-label="Cerrar invitacion"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="pr-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mb-3">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3 className="text-xl font-bold leading-tight">Ayudanos a sostener el proyecto</h3>
            <p className="text-base text-slate-600 mt-2 leading-relaxed">
              Con tu aporte apoyas una experiencia educativa publica y gratuita para miles de jovenes.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link
                to="/donar"
                onClick={closePopup}
                className="inline-flex w-full items-center justify-center rounded-full bg-blue-950 text-white font-semibold text-base py-3 px-5 hover:bg-blue-900 transition-colors duration-200"
              >
                Quiero aportar
              </Link>
            </motion.div>
            <button
              type="button"
              onClick={hidePopupFor24Hours}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              No volver a mostrar
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default DonationHomePopup;
