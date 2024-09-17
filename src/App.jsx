import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa Router aquí
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes'; // React buscará automáticamente el archivo index.jsx en la carpeta routes
import Header from './components/Header';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router> {/* Envuelve la aplicación con el componente Router */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
