import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'], // Esto es para que Vite incluya las imágenes en la carp
  server: {
    open: true, // Esto abre automáticamente el navegador cuando inicies el servidor
  }
});
