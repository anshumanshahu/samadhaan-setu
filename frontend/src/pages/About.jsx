import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anshuman-shahu/",
    icon: <FaLinkedinIn aria-hidden="true" />,
  },
  {
    label: "X",
    href: "https://x.com/anshumanshahu12",
    icon: <FaXTwitter aria-hidden="true" />,
  },
];

const About = () => (
  <main className="bg-brand-green/5">
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-20">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green">
          <FaMapMarkerAlt aria-hidden="true" />
          Built for Nagpur
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          A better way to speak up for your neighbourhood.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Samadhaan Setu is a civic issue reporting platform designed to help
          people share local concerns clearly. A photo, a location, and a short
          description can turn a problem on your street into a report you can
          keep track of.
        </p>
        <Link
          to="/how-it-works"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-green/90"
        >
          See how it works <FaArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-brand-green p-8 text-white shadow-xl sm:p-10">
        <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full border border-white/15" />
        <div className="absolute -bottom-8 -right-2 h-32 w-32 rounded-full border border-white/15" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
            Our purpose
          </p>
          <p className="mt-5 text-2xl font-semibold leading-relaxed sm:text-3xl">
            Make civic reporting feel clear, accessible, and connected to the
            people who call a place home.
          </p>
          <div className="mt-8 h-px bg-white/20" />
          <p className="mt-5 text-sm leading-6 text-white/70">
            Your voice, delivered to the administration.
          </p>
        </div>
      </div>
    </section>

    <section className="border-y border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
            Photo-first
          </p>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            Show what needs attention
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Attach a photo to give your report helpful visual context.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
            Location-aware
          </p>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            Point to the right place
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Add location details so the issue can be understood in context.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
            Transparent
          </p>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            Keep up with your report
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Return to the tracking page to see the latest status of your
            complaints.
          </p>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
          Website made by
        </p>
        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Anshuman Shahu
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Building a more approachable digital bridge between citizens and
              civic services.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Anshuman Shahu on ${social.label}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-brand-green hover:bg-brand-green/5 hover:text-brand-green"
              >
                {social.icon}
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default About;
