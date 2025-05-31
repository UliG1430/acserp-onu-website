import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa Router aquí
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes'; // React buscará automáticamente el archivo index.jsx en la carpeta routes
import Header from './components/Header';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
<Router>
  <ScrollToTop />
  <div className="w-full overflow-x-hidden">
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  </div>
</Router>

  );
}

export default App;
