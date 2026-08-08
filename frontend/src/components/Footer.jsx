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
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <p className="font-bold text-lg mb-3">Samadhaan Setu</p>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Connecting citizens with municipal authorities to report and
              resolve civic issues faster.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-sm mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/70 hover:text-white transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-sm text-white/60">
            &copy; 2026 Samadhaan Setu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;