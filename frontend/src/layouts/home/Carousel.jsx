import { useEffect, useState } from "react";

const slides = [
  {
    tag: "Live in Nagpur",
    title: "See a civic issue? Report it in under a minute.",
    subtitle:
      "Potholes, garbage, broken streetlights — track every complaint until it's resolved.",
    cta: "Report an Issue",
  },
  {
    tag: "Transparent",
    title: "Every complaint reaches the right department, directly.",
    subtitle:
      "No middlemen. Your report routes straight to the concerned ward officer.",
    cta: "See How it Works",
  },
  {
    tag: "Community Powered",
    title: "Neighbours verify issues that affect the whole ward.",
    subtitle: "Upvote existing complaints so nothing gets lost in the queue.",
    cta: "Explore Categories",
  },
];

const Carousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <div className="relative bg-brand-green text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <span className="inline-block text-xs font-medium tracking-wide uppercase bg-white/10 px-4 py-1.5 rounded-full mb-6">
          {slide.tag}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto leading-tight">
          {slide.title}
        </h1>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
          {slide.subtitle}
        </p>
        <button className="bg-brand-coral text-white font-medium px-6 py-3 rounded-full hover:opacity-90 transition">
          {slide.cta}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;