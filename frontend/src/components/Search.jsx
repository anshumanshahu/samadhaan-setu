import { useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const categories = [
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water Leakage",
  "Drainage",
  "Public Safety",
];

const Search = () => {
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: navigate to report page, e.g. navigate(`/report?area=${area}&category=${category}`)
  }

  return (
    <div className="max-w-4xl mx-auto -mt-8 md:-mt-10 relative z-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4 flex flex-col md:flex-row gap-3"
      >
        <div className="flex items-center gap-2 flex-1 px-3 border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0">
          <FaMapMarkerAlt className="text-brand-green shrink-0" />
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter your ward or pincode"
            className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 text-sm text-gray-700 outline-none bg-transparent"
        >
          <option value="">Select issue type</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-brand-green text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-brand-green/90 transition"
        >
          <FaSearch />
          Report Issue
        </button>
      </form>
    </div>
  );
};

export default Search;