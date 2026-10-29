import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCamera,
  FaCheckCircle,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

const steps = [
  {
    number: "01",
    icon: <FaCamera />,
    title: "Capture the issue",
    description:
      "Take a clear photo of the civic issue or choose one from your device. A good photo helps show what needs attention.",
  },
  {
    number: "02",
    icon: <FaSearch />,
    title: "Confirm the issue",
    description:
      "The photo is checked for a recognised civic issue. If it is not clear, you can choose another image and try again.",
  },
  {
    number: "03",
    icon: <FaMapMarkerAlt />,
    title: "Add location and details",
    description:
      "Review the detected location, add a short description, and submit your report so it has useful context.",
  },
  {
    number: "04",
    icon: <FaClipboardCheck />,
    title: "Follow its progress",
    description:
      "Sign in to view your submitted complaints and check their latest status from the Track Status page.",
  },
];

const HowItWorks = () => (
  <main className="bg-brand-green/5">
    <section className="relative overflow-hidden bg-brand-green px-4 py-16 text-white sm:py-20 md:px-8">
      <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/10" />
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
          <FaCheckCircle aria-hidden="true" />
          Your voice, delivered to the administration
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          From a street-level issue to a report you can follow.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
          Samadhaan Setu gives Nagpur residents a straightforward way to share
          civic concerns with a photo, a location, and the details that matter.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-coral/90"
          >
            Report an issue <FaArrowRight aria-hidden="true" />
          </Link>
          <Link
            to="/track"
            className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Track a report
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
          The process
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Four simple steps to raise a concern
        </h2>
        <p className="mt-4 leading-7 text-gray-600">
          Share what you see, add enough context to make it actionable, and
          return to check on your report.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <article
            key={step.number}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-xl text-brand-green">
                {step.icon}
              </span>
              <span className="text-sm font-bold tracking-widest text-brand-coral">
                {step.number}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-brand-green/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="font-semibold text-gray-900">
            Ready to make your neighbourhood better?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Start with a photo and a few details.
          </p>
        </div>
        <Link
          to="/report"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-green/90"
        >
          Start a report <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  </main>
);

export default HowItWorks;
