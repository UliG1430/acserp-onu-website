import React, { useEffect, useState } from "react";

// Calcula tiempo restante al 23 de septiembre de 2025, 08:00 AM
const getTimeLeft = () => {
  const eventDate = new Date("2025-09-23T08:00:00");
  const now = new Date();
  const difference = eventDate - now;

  if (difference <= 0) return null;

  return {
    días: Math.floor(difference / (1000 * 60 * 60 * 24)),
    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((difference / 1000 / 60) % 60),
    segundos: Math.floor((difference / 1000) % 60),
  };
};

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-indigo-100 text-blue-950 text-sm md:text-base py-2 px-4 text-center shadow font-bold tracking-wide z-40">
       ¡Faltan {timeLeft.días} días, {timeLeft.horas}h {timeLeft.minutos}m {timeLeft.segundos}s para VIII Modelo ONU La Plata!
    </div>
  );
};

export default CountdownBanner;
