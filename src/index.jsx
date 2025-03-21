import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async'; // ✅

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider> {/* ✅ Provee el contexto a toda la app */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);


//MVP
// 1. NUESTRA HISTORIA
// 2. NOTICIA PREMIOS HOMERO MANZI
// 3. NOTICIAS CARRUSEL
// 4. DONACIONES
// 5. REDES