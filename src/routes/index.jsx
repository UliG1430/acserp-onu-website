import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Photos from "../pages/Photos";
import Model from "../pages/Model";
import ACSERPPage from "../pages/ACSERPPage";
import SocialMediaPage from "../pages/SocialMediaPage";
import DonationsPage from "../pages/DonationsPage";
import NewsDetail from "../pages/NewsDetail";
import Resources from "../pages/Resources";
import ScrollToTop from "../components/ScrollToTop";
import { shouldUseSafeMode } from "../utils/runtimeSafety";

/* Apple-style: very short fade — almost imperceptible, just enough to feel polished */
const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.div>
);

function AppRoutes() {
  const location = useLocation();
  const safeMode = useMemo(() => shouldUseSafeMode(), []);

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/"           element={<PageWrapper><Home /></PageWrapper>} />
      <Route path="/acserp"     element={<PageWrapper><ACSERPPage /></PageWrapper>} />
      <Route path="/about"      element={<PageWrapper><About /></PageWrapper>} />
      <Route path="/contact"    element={<PageWrapper><Contact /></PageWrapper>} />
      <Route path="/fotos"      element={<PageWrapper><Photos /></PageWrapper>} />
      <Route path="/organos"    element={<PageWrapper><Model /></PageWrapper>} />
      <Route path="/redes"      element={<PageWrapper><SocialMediaPage /></PageWrapper>} />
      <Route path="/donar"      element={<PageWrapper><DonationsPage /></PageWrapper>} />
      <Route path="/recursos"   element={<PageWrapper><Resources /></PageWrapper>} />
      <Route path="/noticias/:id" element={<PageWrapper><NewsDetail /></PageWrapper>} />
      <Route path="*"           element={<PageWrapper><NotFound /></PageWrapper>} />
    </Routes>
  );

  return (
    <>
      <ScrollToTop />
      {safeMode
        ? routes
        : <AnimatePresence mode="wait" initial={false}>{routes}</AnimatePresence>}
    </>
  );
}

export default AppRoutes;
