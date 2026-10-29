import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "Report Issue", to: "/under-development" },
  { label: "Track Status", to: "/track" },
  { label: "About", to: "/about" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0];

  const handleReport = () => {
    setOpen(false);
    // /report is protected: logged-out users are sent to /login and come back after
    navigate("/report");
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Samadhaan Setu" className="h-12 w-auto" />
          <span className="font-bold text-lg text-brand-green">Samadhaan Setu</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-brand-green transition">
              {l.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-brand-coral font-semibold hover:opacity-80 transition">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-gray-600">
                Hi, {firstName}
              </span>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex text-sm font-medium px-5 py-2.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green/5 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium px-5 py-2.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green/5 transition"
            >
              Login
            </Link>
          )}

          <button
            onClick={handleReport}
            className="hidden sm:inline-flex bg-brand-green text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brand-green/90 transition"
          >
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
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-gray-100 text-sm font-medium text-gray-600"
            >
              {l.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="py-3 border-b border-gray-100 text-sm font-semibold text-brand-coral"
            >
              Admin panel
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="mt-4 text-sm font-medium px-5 py-2.5 rounded-full border border-brand-green text-brand-green"
            >
              Logout ({firstName})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-4 text-center text-sm font-medium px-5 py-2.5 rounded-full border border-brand-green text-brand-green"
            >
              Login / Sign up
            </Link>
          )}

          <button
            onClick={handleReport}
            className="mt-3 bg-brand-green text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Report an Issue
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;