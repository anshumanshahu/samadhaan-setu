import logo from "../assets/logo.png";
import { FaFacebookF } from "react-icons/fa";

const footerLinks = [
  {
    title: "Services",
    links: [
      "Report an Issue",
      "Track Complaint",
      "Community Verification",
      "Ward Dashboard",
      "Analytics",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Partners"],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Contact Us",
      "Privacy Policy",
      "Terms of Service",
      "Grievance Policy",
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <img src={logo} alt="Samadhaan Setu" className="h-16 w-auto mb-3" />
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
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs sm:text-sm text-gray-500 hover:text-brand-green transition"
                      >
                        {link}
                      </a>
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
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center hover:bg-brand-green hover:text-white transition"
            >
              <FaFacebookF className="text-xs" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;