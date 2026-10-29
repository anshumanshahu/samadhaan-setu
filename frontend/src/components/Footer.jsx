import { Link } from "react-router-dom";
import logo from "../assets/logo_name.png";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Report an Issue", to: "/report" },
      { label: "Track Complaint", to: "/track" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it Works", to: "/how-it-works" },
      { label: "About Us", to: "/about" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "LinkedIn",
        to: "https://www.linkedin.com/in/anshuman-shahu/",
        external: true,
      },
      {
        label: "X",
        to: "https://x.com/anshumanshahu12",
        external: true,
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <img src={logo} alt="Samadhaan Setu" className="h-25 w-auto mb-3" />
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting citizens with municipal authorities to report and
              resolve civic issues faster.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-10 flex-1 md:max-w-xl">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-sm text-gray-900 mb-3">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.to}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs sm:text-sm text-gray-500 hover:text-brand-green transition"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-xs sm:text-sm text-gray-500 hover:text-brand-green transition"
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
        </div>

        <div className="border-t border-gray-100 pt-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            &copy; 2026 Samadhaan Setu. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/anshuman-shahu/"
              target="_blank"
              rel="noreferrer"
              aria-label="Anshuman Shahu on LinkedIn"
              className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center hover:bg-brand-green hover:text-white transition"
            >
              <FaLinkedinIn className="text-xs" />
            </a>
            <a
              href="https://x.com/anshumanshahu12"
              target="_blank"
              rel="noreferrer"
              aria-label="Anshuman Shahu on X"
              className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center hover:bg-brand-green hover:text-white transition"
            >
              <FaXTwitter className="text-xs" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;