import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faYoutube,
  faLinkedin,
  faTiktok,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

const socialLinks = [
  {
    icon: faLinkedin,
    href: "https://www.linkedin.com/in/simulacros-educativos-r%C3%ADo-de-la-plata-b45698230/",
    label: "LinkedIn",
    hoverBg: "hover:bg-[#0077B5]",
  },
  {
    icon: faTiktok,
    href: "https://www.tiktok.com/@modeloonulp",
    label: "TikTok",
    hoverBg: "hover:bg-black",
  },
  {
    icon: faInstagram,
    href: "https://www.instagram.com/modeloonulp/?hl=es",
    label: "Instagram",
    hoverBg: "hover:bg-pink-600",
  },
  {
    icon: faYoutube,
    href: "https://www.youtube.com/@modeloonulaplata",
    label: "YouTube",
    hoverBg: "hover:bg-red-600",
  },
];

const navColumns = [
  {
    title: "Navegación",
    links: [
      { label: "Inicio",    to: "/" },
      { label: "ACSERP",   to: "/acserp" },
      { label: "Órganos",  to: "/organos" },
      { label: "Fotos",    to: "/fotos" },
      { label: "Redes",    to: "/redes" },
    ],
  },
  {
    title: "Participa",
    links: [
      { label: "Donar",   to: "/donar" },
      { label: "Recursos", to: "/recursos" },
      {
        label: "Sumate como voluntario",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSdSs6OBExmEBdEZiWE9vbNZXVkc92WqEZcmVkZpclx1AucDFw/viewform",
        external: true,
      },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-white">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-2 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            ACSERP ONU
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-sm">
            Asociación Civil Simulacros Educativos Río de la Plata.
            Organizamos el simulacro educativo de Naciones Unidas más grande y
            gratuito de Argentina.
          </p>
          {/* Social icons */}
          <div className="flex gap-3 pt-2">
            {socialLinks.map(({ icon, href, label, hoverBg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex items-center justify-center w-9 h-9 rounded-full
                  border border-white/20 text-white/70 hover:text-white
                  hover:border-white/40 ${hoverBg}
                  transition-all duration-200 hover:scale-105`}
              >
                <FontAwesomeIcon icon={icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {navColumns.map((col) => (
          <div key={col.title} className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              {col.title}
            </p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
          flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {year} Asociación Civil Simulacros Educativos Río de la Plata</p>
          <a
            href="https://github.com/UliG1430"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white/70 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
            Desarrollado por Ulises Geymonat
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
