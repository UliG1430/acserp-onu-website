import React, { useEffect, useState } from "react";

const EVENT_DATE = new Date("2025-09-23T08:00:00");

const getTimeLeft = () => {
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) return null;
  return {
    días:    Math.floor(diff / 86_400_000),
    horas:   Math.floor((diff / 3_600_000) % 24),
    minutos: Math.floor((diff / 60_000) % 60),
    segundos: Math.floor((diff / 1_000) % 60),
  };
};

const pad = (n) => String(n).padStart(2, '0');

const CountdownBanner = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-brand-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span className="text-white/70 text-xs sm:text-sm font-medium tracking-wide uppercase">
          VIII Modelo ONU La Plata
        </span>
        <span className="hidden sm:block text-white/30 text-xs">·</span>
        <div className="flex items-center gap-3">
          {[
            { value: timeLeft.días,     label: 'd' },
            { value: timeLeft.horas,    label: 'h' },
            { value: timeLeft.minutos,  label: 'm' },
            { value: timeLeft.segundos, label: 's' },
          ].map(({ value, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className="text-white/30 font-light text-sm">:</span>}
              <span className="flex items-baseline gap-0.5">
                <span className="text-white font-semibold text-sm tabular-nums">
                  {pad(value)}
                </span>
                <span className="text-white/50 text-xs">{label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
