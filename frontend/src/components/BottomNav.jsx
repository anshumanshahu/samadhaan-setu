import { useState } from "react";
import {
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";

const items = [
  { key: "home", label: "Home", icon: <FaHome /> },
  { key: "track", label: "Track Status", icon: <FaMapMarkedAlt /> },
  { key: "report", label: "Report", icon: <FaPlus />, center: true },
  { key: "complaints", label: "Solved Reports", icon: <FaClipboardList /> },
  { key: "profile", label: "Profile", icon: <FaUserCircle /> },
];

const BottomNav = () => {
  const [active, setActive] = useState("home");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between px-2">
        {items.map((item) =>
          item.center ? (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
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
              onClick={() => setActive(item.key)}
              className="flex flex-col items-center gap-1 py-2.5 px-2 flex-1"
            >
              <span
                className={`text-lg ${
                  active === item.key ? "text-brand-green" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] leading-none text-center ${
                  active === item.key
                    ? "text-brand-green font-medium"
                    : "text-gray-400"
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