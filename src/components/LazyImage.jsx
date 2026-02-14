import React, { useState } from "react";

const LazyImage = ({ src, alt, className = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm"} ${className}`}
        {...props}
      />

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/25 backdrop-blur-sm pointer-events-none">
          <div className="w-9 h-9 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white text-xs md:text-sm pointer-events-none">
          Error al cargar imagen
        </div>
      )}
    </div>
  );
};

export default LazyImage;
