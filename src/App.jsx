import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import Header from './components/Header';
import DonationHomePopup from './components/DonationHomePopup';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollToTop from './components/ScrollToTop';
import { useSiteContent } from './context/SiteContentContext';

function AppShell() {
  const location = useLocation();
  const { loading } = useSiteContent();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <div className="w-full overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <Header />
          <Navbar />
          <main className="flex-grow">
            {loading ? (
              <div className="min-h-[60vh] bg-white" aria-label="Cargando contenido" />
            ) : (
              <AppRoutes />
            )}
          </main>
          <Footer />
        </div>
      </div>
      {!isAdminRoute && <DonationHomePopup />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
