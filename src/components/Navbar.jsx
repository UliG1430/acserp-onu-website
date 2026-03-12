import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/Azul Viejo - Logo ACSERP + Texto.png';

const navLinks = [
  { name: 'Inicio',    path: '/' },
  { name: 'ACSERP',   path: '/acserp' },
  { name: 'Órganos',  path: '/organos' },
  { name: 'Recursos', path: '/recursos', target: '_blank' },
  { name: 'Fotos',    path: '/fotos' },
  { name: 'Redes',    path: '/redes' },
  { name: 'Donar',    path: '/donar' },
  {
    name: 'Sumate',
    path: 'https://docs.google.com/forms/d/e/1FAIpQLSdSs6OBExmEBdEZiWE9vbNZXVkc92WqEZcmVkZpclx1AucDFw/viewform',
    target: '_blank',
    cta: true,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300
        ${scrolled ? 'shadow-[0_1px_24px_rgba(18,20,69,0.10)]' : 'border-b border-gray-100'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <Link
            to="/"
            aria-label="Inicio — ACSERP ONU"
            className="shrink-0 flex items-center"
          >
            <img
              src={logo}
              alt="Simulacros Educativos Río de la Plata"
              className="h-14 w-auto"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const isExternal = link.path.startsWith('http');
              const active     = !isExternal && isActive(link.path);

              if (link.cta) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target={link.target}
                    rel="noopener noreferrer"
                    className="ml-4 px-5 py-2.5 bg-brand-900 text-white text-sm font-semibold
                      rounded-full hover:bg-brand-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.name}
                  </a>
                );
              }

              const cls = `relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150
                after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full
                after:transition-opacity after:duration-200
                ${active
                  ? 'text-brand-900 after:bg-brand-900 after:opacity-100'
                  : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50 after:bg-brand-900 after:opacity-0 hover:after:opacity-40'
                }`;

              return isExternal ? (
                <a
                  key={link.name}
                  href={link.path}
                  target={link.target}
                  rel="noopener noreferrer"
                  className={cls}
                >
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.path} className={cls}>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg
              text-gray-700 hover:bg-gray-100 transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 gap-[5px]"
          >
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300
              ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300
              ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300
              ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={`lg:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="px-4 py-3 space-y-0.5 bg-white" aria-label="Menú móvil">
          {navLinks.map((link) => {
            const isExternal = link.path.startsWith('http');
            const active     = !isExternal && isActive(link.path);

            const cls = `block px-4 py-3 text-base font-medium rounded-xl transition-colors duration-150
              ${link.cta
                ? 'mt-2 text-center bg-brand-900 text-white hover:bg-brand-800'
                : active
                  ? 'bg-brand-50 text-brand-900'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-900'
              }`;

            return isExternal ? (
              <a
                key={link.name}
                href={link.path}
                target={link.target}
                rel="noopener noreferrer"
                className={cls}
              >
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.path} className={cls}>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
