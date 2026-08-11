import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/under-development" },
  { label: "Report Issue", href: "/under-development" },
  { label: "Track Status", href: "/under-development" },
  { label: "About", href: "/under-development" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="Samadhaan Setu" className="h-16 w-auto shrink-0" />
          <span className="font-extrabold text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] leading-none tracking-[-0.04em] text-brand-green whitespace-nowrap">
            Samadhaan Setu
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[0.82rem] lg:text-[0.9rem] font-semibold text-gray-600">
          {navLinks.map((l) => (
            <NavLink
              key={l.label}
              to={l.href}
              className={({ isActive }) =>
                `hover:text-brand-green transition-colors duration-200 ${isActive ? "text-brand-green" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/under-development"
            className="hidden sm:inline-flex bg-brand-green text-white text-[0.82rem] md:text-sm font-semibold px-4 md:px-5 py-2.5 rounded-full hover:bg-brand-green/90 transition-colors duration-200 whitespace-nowrap"
          >
            Log In / Sign Up
          </NavLink>
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
            <NavLink
              key={l.label}
              to={l.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-gray-100 text-sm font-medium text-gray-600"
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/under-development"
            onClick={() => setOpen(false)}
            className="mt-4 bg-brand-green text-white text-sm font-medium px-5 py-2.5 rounded-full text-center"
          >
            Report an Issue
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;