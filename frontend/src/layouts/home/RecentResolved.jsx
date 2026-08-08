import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const resolved = [
  { title: "Pothole on MG Road", ward: "Ward 12", days: "2 days", area: "Sadar" },
  { title: "Overflowing garbage bin", ward: "Ward 7", days: "1 day", area: "Dharampeth" },
  { title: "Broken streetlight", ward: "Ward 21", days: "3 days", area: "Civil Lines" },
  { title: "Water pipeline leakage", ward: "Ward 5", days: "4 days", area: "Sitabuldi" },
];

const RecentResolved = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
      {resolved.map((r) => (
        <div
          key={r.title}
          className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
        >
          <div className="flex items-center gap-2 text-brand-green text-sm font-medium mb-3">
            <FaCheckCircle /> Resolved in {r.days}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <FaMapMarkerAlt className="shrink-0" /> {r.area}, {r.ward}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentResolved;