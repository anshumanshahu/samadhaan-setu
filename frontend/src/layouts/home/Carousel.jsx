import { useEffect, useState } from "react";
import heroBanner from "../../assets/hero-banner.png";

const slides = [
  {
    tag: "Live in Nagpur",
    title: "See a civic issue? Report it in under a minute.",
    subtitle:
      "Potholes, garbage, broken streetlights - track every complaint until it's resolved.",
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
  const [fade, setFade] = useState(true); // Transition ke liye naya state

  useEffect(() => {
    const id = setInterval(() => {
      // Pehle text ko fade out karo
      setFade(false);
      
      // 300ms baad text change karo aur wapas fade in karo
      setTimeout(() => {
        setActive((a) => (a + 1) % slides.length);
        setFade(true);
      }, 300);
    }, 5000);
    
    return () => clearInterval(id);
  }, []);

  // Jab user dots par click kare tab bhi smooth transition ho
  const handleDotClick = (index) => {
    if (index === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(index);
      setFade(true);
    }, 300);
  };

  const slide = slides[active];

  return (
    <div className="relative w-full overflow-hidden min-h-[500px] md:min-h-[550px] flex items-center bg-[#0B3D3A]">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 transition-opacity duration-700">
        <img
          src={heroBanner}
          alt="Citizens reporting civic issues"
          className="w-full h-full object-cover object-center md:object-right"
        />
        <div className="absolute inset-0 bg-[#0B3D3A]/85 md:bg-transparent md:bg-gradient-to-r md:from-[#0B3D3A] md:via-[#0B3D3A]/80 md:to-transparent"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        
        {/* YAHAN ANIMATION CLASSES ADD KI GAYI HAIN */}
        <div 
          className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left flex flex-col items-center md:items-start transition-all duration-500 ease-in-out transform ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block text-[10px] md:text-xs font-semibold tracking-wide uppercase bg-white/20 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6 backdrop-blur-sm">
            {slide.tag}
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-md">
            {slide.title}
          </h1>
          
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-md sm:max-w-xl mb-6 md:mb-8">
            {slide.subtitle}
          </p>
          
          <button className="bg-[#FF6B54] text-white font-medium px-6 py-3 md:px-8 md:py-3.5 rounded-full hover:bg-[#e55a44] transition-all shadow-lg text-base md:text-lg w-full sm:w-auto">
            {slide.cta}
          </button>
        </div>

        {/* Dots slider ko animation block se bahar rakha hai taaki wo hide na ho */}
        <div className="flex items-center justify-center md:justify-start gap-2 mt-8 md:mt-12 max-w-2xl mx-auto md:mx-0">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 md:w-8 bg-white" : "w-1.5 md:w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Carousel;