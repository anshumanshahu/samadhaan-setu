import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const BottomNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // pages abhi bane nahi hain, isliye placeholder; login ke bina login page par bhejte hain
  const protectedTo = user ? "/under-development" : "/login";

  const items = [
    { key: "home", label: "Home", icon: <FaHome />, to: "/", active: pathname === "/" },
    { key: "track", label: "Track Status", icon: <FaMapMarkedAlt />, to: "/track", active: pathname === "/track" },
    { key: "report", label: "Report", icon: <FaPlus />, to: "/report", center: true },
    { key: "complaints", label: "Your Complaints", icon: <FaClipboardList />, to: "/track" },
    {
      key: "profile",
      label: user ? "Profile" : "Login",
      icon: <FaUserCircle />,
      to: protectedTo,
      active: pathname === "/login" || pathname === "/signup",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between px-2">
        {items.map((item) =>
          item.center ? (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              className="relative -top-4 flex flex-col items-center"
              aria-label={item.label}
            >
              <span className="w-12 h-12 rounded-full bg-brand-coral text-white flex items-center justify-center text-lg shadow-lg shadow-brand-coral/30">
                {item.icon}
              </span>
            </button>
          ) : (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              className="flex flex-col items-center gap-1 py-2.5 px-2 flex-1"
            >
              <span className={`text-lg ${item.active ? "text-brand-green" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] leading-none text-center ${
                  item.active ? "text-brand-green font-medium" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default BottomNav;