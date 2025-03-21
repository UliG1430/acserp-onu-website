import React, { useState } from "react";

const LazyImage = ({ src, alt, className = "", ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  console.log("🖼 Intentando cargar imagen:", src);

  return (
    <img
      src={src}  // ✅ Ahora src es la URL de importación procesada por Vite
      alt={alt}
      loading="lazy"
      onLoad={() => {
        console.log(`✅ Imagen cargada con éxito: ${src}`);
        setLoaded(true);
      }}
      onError={() => {
        console.error(`❌ Error al cargar la imagen: ${src}`);
        setError(true);
      }}
      className={`transition-opacity duration-700 ease-in-out
        ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        ${className}`}
      {...props}
    />
  );
};

export default LazyImage;
