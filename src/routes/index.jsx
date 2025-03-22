import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Importamos AnimatePresence
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
import ScrollToTop from "../components/ScrollToTop"; // Para cargar siempre desde arriba

function AppRoutes() {
  const location = useLocation(); // Obtén la ubicación actual para las transiciones

  return (
    <>
      <ScrollToTop /> {/* Resetea el scroll al inicio en cada cambio de ruta */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/acserp" element={<ACSERPPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/fotos" element={<Photos />} />
          <Route path="/organos" element={<Model />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/redes" element={<SocialMediaPage />} />
          <Route path="/donaciones" element={<DonationsPage />} />
          <Route path="/noticias/:id" element={<NewsDetail />} /> {/* Detalle de noticia */}
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default AppRoutes;
