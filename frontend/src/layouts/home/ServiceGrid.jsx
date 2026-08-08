import {
  FaRoad,
  FaTrash,
  FaLightbulb,
  FaTint,
  FaTree,
  FaShieldAlt,
} from "react-icons/fa";

const services = [
  {
    icon: <FaRoad />,
    title: "Roads & Potholes",
    desc: "Damaged roads, potholes, broken footpaths",
  },
  {
    icon: <FaTrash />,
    title: "Garbage & Sanitation",
    desc: "Uncollected waste, overflowing bins",
  },
  {
    icon: <FaLightbulb />,
    title: "Street Lighting",
    desc: "Broken or non-functional streetlights",
  },
  {
    icon: <FaTint />,
    title: "Water Supply",
    desc: "Leakage, contamination, low pressure",
  },
  {
    icon: <FaTree />,
    title: "Parks & Public Spaces",
    desc: "Damaged parks, overgrowth, encroachment",
  },
  {
    icon: <FaShieldAlt />,
    title: "Public Safety",
    desc: "Open manholes, unsafe construction sites",
  },
];

const ServiceGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {services.map((s) => (
        <div
          key={s.title}
          className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-md hover:-translate-y-1 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center text-lg mb-4">
            {s.icon}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
          <p className="text-sm text-gray-500">{s.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;