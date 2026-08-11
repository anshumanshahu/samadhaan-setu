import logo from "../assets/logo.png";

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
    <footer className="bg-brand-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 md:pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <img src={logo} alt="Samadhaan Setu" className="h-16 w-auto mb-3" />
            <p className="font-bold text-lg sm:text-xl mb-3">Samadhaan Setu</p>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Connecting citizens with municipal authorities to report and
              resolve civic issues faster.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title} className="min-w-0">
              <p className="font-semibold text-sm mb-3 md:mb-4 uppercase tracking-wide text-white/90">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5 md:pt-6">
          <p className="text-xs sm:text-sm text-white/60 text-center md:text-left">
            &copy; 2026 Samadhaan Setu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;