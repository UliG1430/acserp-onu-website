import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const ArrowBase = ({ onClick, label, Icon, side }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`
      absolute ${side === 'right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'}
      top-1/2 -translate-y-1/2 z-10
      flex items-center justify-center
      w-11 h-11 sm:w-13 sm:h-13
      rounded-full bg-white/90 hover:bg-white
      shadow-lg hover:shadow-xl
      text-gray-900
      transition-all duration-200
      hover:scale-110
      focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
      backdrop-blur-sm
    `}
    style={{ width: '48px', height: '48px' }}
  >
    <Icon className="w-5 h-5" />
  </button>
);

export const NextArrow = ({ onClick }) => (
  <ArrowBase onClick={onClick} label="Siguiente" Icon={ChevronRightIcon} side="right" />
);

export const PrevArrow = ({ onClick }) => (
  <ArrowBase onClick={onClick} label="Anterior" Icon={ChevronLeftIcon} side="left" />
);
