import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "How it Works", href: "#" },
  { label: "Report Issue", href: "#" },
  { label: "Track Status", href: "#" },
  { label: "About", href: "#" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="Samadhaan Setu" className="h-16 w-auto shrink-0" />
          <span className="font-extrabold text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] leading-none tracking-[-0.04em] text-brand-green whitespace-nowrap">
            Samadhaan Setu
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[0.82rem] lg:text-[0.9rem] font-semibold text-gray-600">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-brand-green transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex bg-brand-green text-white text-[0.82rem] md:text-sm font-semibold px-4 md:px-5 py-2.5 rounded-full hover:bg-brand-green/90 transition-colors duration-200 whitespace-nowrap">
            Report an Issue
          </button>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-brand-green"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col bg-white border-t border-gray-100 px-4 pb-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="py-3 border-b border-gray-100 text-sm font-medium text-gray-600"
            >
              {l.label}
            </a>
          ))}
          <button className="mt-4 bg-brand-green text-white text-sm font-medium px-5 py-2.5 rounded-full">
            Report an Issue
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;