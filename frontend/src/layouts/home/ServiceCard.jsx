import { FaClock, FaMapMarkedAlt, FaUsers, FaCheckDouble } from "react-icons/fa";

const stats = [
  { icon: <FaMapMarkedAlt />, num: "12,400+", label: "Issues reported" },
  { icon: <FaCheckDouble />, num: "9,800+", label: "Issues resolved" },
  { icon: <FaUsers />, num: "42", label: "Wards covered" },
  { icon: <FaClock />, num: "3 days", label: "Avg. resolution time" },
];

const ServiceCard = () => {
  return (
    <div className="bg-brand-green">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center gap-2">
            <span className="text-2xl text-brand-coral">{s.icon}</span>
            <span className="text-2xl font-bold">{s.num}</span>
            <span className="text-sm text-white/70">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;