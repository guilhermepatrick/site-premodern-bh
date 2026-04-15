import { NavLink, Link } from 'react-router-dom';
import { Instagram, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Início', end: true },
  { to: '/ranking', label: 'Ranking' },
  { to: '/etapas', label: 'Etapas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-pm-bg/95 backdrop-blur border-b-2 border-pm-frame">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pm-gold to-transparent" />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pm-gold ring-offset-2 ring-offset-pm-bg group-hover:ring-pm-gold-hi transition">
            <img src="/refs/logo.jpg" alt="Premodern Beagá" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="font-title font-bold text-pm-cream text-lg tracking-wider">PREMODERN</div>
            <div className="font-title text-pm-gold text-xs tracking-[0.3em]">BEAGÁ</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `font-title tracking-wider px-4 py-2 rounded-sm transition ${
                  isActive
                    ? 'text-pm-gold-hi bg-pm-bg-2 shadow-old-frame-gold'
                    : 'text-pm-cream hover:text-pm-gold-hi'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="https://www.instagram.com/premodernbeaga/"
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-2 text-pm-cream hover:text-pm-gold-hi transition px-3 py-2"
            aria-label="Instagram da liga"
          >
            <Instagram size={20} />
          </a>
        </nav>

        <button
          className="md:hidden text-pm-cream"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-pm-frame bg-pm-bg-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-title tracking-wider px-6 py-3 border-b border-pm-frame ${
                  isActive ? 'text-pm-gold-hi' : 'text-pm-cream'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="https://www.instagram.com/premodernbeaga/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 text-pm-cream"
          >
            <Instagram size={18} /> Instagram
          </a>
        </nav>
      )}
    </header>
  );
}
