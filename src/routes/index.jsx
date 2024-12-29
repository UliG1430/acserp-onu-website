import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Photos from '../pages/Photos';
import Model from '../pages/Model';
import ACSERPPage from '../pages/ACSERPPage';
import SocialMediaPage from '../pages/SocialMediaPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/acserp" element={<ACSERPPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/fotos" element={<Photos />} /> 
      <Route path="/modelo" element={<Model />} /> 
      <Route path="*" element={<NotFound />} />
      <Route path="/redes" element={<SocialMediaPage />} /> 

    </Routes>
  );
}

export default AppRoutes;
