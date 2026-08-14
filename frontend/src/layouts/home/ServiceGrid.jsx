import roadsImage from "../../assets/services/roads.png";
import garbageImage from "../../assets/services/garbage.png";
import waterImage from "../../assets/services/water.png";
import safetyImage from "../../assets/services/man.png";

const services = [
  {
    image: roadsImage,
    title: "Roads & Potholes",
    desc: "Damaged roads, potholes, broken footpaths",
  },
  {
    image: garbageImage,
    title: "Garbage & Sanitation",
    desc: "Uncollected waste, overflowing bins",
  },
  {
    image: waterImage,
    title: "Water Supply",
    desc: "Leakage, contamination, low pressure",
  },
  {
    image: safetyImage,
    title: "Public Safety",
    desc: "Open manholes, unsafe construction sites",
  },
];

const ServiceGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {services.map((service) => (
        <div
          key={service.title}
          className="
            bg-white
            border border-gray-100
            rounded-2xl
            overflow-hidden
            hover:shadow-lg
            hover:-translate-y-1
            transition-all
            duration-300
            group
          "
        >
          {/* Image */}
          <div
            className="
              w-full
              h-28
              sm:h-36
              md:h-40
              bg-gray-50
              flex
              items-center
              justify-center
              overflow-hidden
              p-3
              sm:p-4
            "
          >
            <img
              src={service.image}
              alt={service.title}
              className="
                w-full
                h-full
                object-contain
                group-hover:scale-105
                transition-transform
                duration-500
              "
            />
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3
              className="
                font-semibold
                text-gray-900
                mb-1
                text-sm
                md:text-base
              "
            >
              {service.title}
            </h3>

            <p
              className="
                text-xs
                md:text-sm
                text-gray-500
                leading-relaxed
              "
            >
              {service.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;