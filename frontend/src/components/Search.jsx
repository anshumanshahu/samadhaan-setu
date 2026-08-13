import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPlus, FaLocationArrow } from "react-icons/fa";

const Search = () => {
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setArea("Location is not supported by your browser");
      return;
    }

    setLoading(true);
    setArea("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();
          const address = data.address || {};

          const road = address.road || "";
          const areaName =
            address.suburb ||
            address.neighbourhood ||
            address.city_district ||
            "";

          const city =
            address.city ||
            address.town ||
            address.village ||
            "";

          const state = address.state || "";

          const locationParts = [
            road,
            areaName,
            city,
            state,
          ].filter(Boolean);

          const fullLocation = [...new Set(locationParts)].join(", ");

          setArea(fullLocation || "Current Location");
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setArea("Unable to detect area");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setArea("Please allow location access");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setArea("Location unavailable");
        } else if (error.code === error.TIMEOUT) {
          setArea("Location request timed out");
        } else {
          setArea("Unable to detect location");
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Report location:", area);

    // TODO:
    // navigate(`/report?area=${encodeURIComponent(area)}`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto -mt-6 sm:-mt-8 md:-mt-10 relative z-10 px-3 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-2xl
          shadow-lg
          border border-gray-100
          p-3 sm:p-4
          flex flex-col
          gap-3
        "
      >
        {/* Location Section */}
        <div
          className="
            w-full
            flex items-center
            gap-3
            px-3 py-3
            sm:px-4
            rounded-xl
            bg-gray-50
            border border-gray-100
          "
        >
          {/* Location Icon */}
          <div
            className="
              shrink-0
              w-9 h-9
              sm:w-10 sm:h-10
              rounded-full
              bg-brand-green/10
              flex items-center justify-center
            "
          >
            <FaMapMarkerAlt className="text-brand-green text-sm sm:text-base" />
          </div>

          {/* Location Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
              Current Location
            </p>

            <p
              className="
                mt-0.5
                text-xs sm:text-sm
                text-gray-700
                font-medium
                truncate
              "
              title={area}
            >
              {area || "Detecting your location..."}
            </p>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading}
            aria-label="Refresh location"
            className="
              shrink-0
              w-9 h-9
              sm:w-auto sm:h-auto
              sm:px-3 sm:py-2
              rounded-lg
              text-brand-green
              bg-brand-green/5
              hover:bg-brand-green/10
              transition
              flex items-center justify-center gap-2
              disabled:opacity-50
            "
          >
            <FaLocationArrow
              className={`text-xs ${loading ? "animate-spin" : ""}`}
            />

            <span className="hidden sm:inline text-xs font-semibold">
              {loading ? "Detecting..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Report Issue Button */}
        <button
          type="submit"
          className="
            w-full
            min-h-[52px]
            flex items-center justify-center
            gap-2.5
            bg-brand-green
            text-white
            font-semibold
            text-sm
            sm:text-base
            px-5 py-3
            rounded-xl
            hover:bg-brand-green/90
            active:scale-[0.98]
            hover:shadow-md
            transition-all duration-200
          "
        >
          <span
            className="
              flex items-center justify-center
              w-7 h-7
              sm:w-8 sm:h-8
              rounded-full
              bg-white/20
            "
          >
            <FaPlus className="text-xs sm:text-sm" />
          </span>

          <span>Report Issue</span>
        </button>
      </form>
    </div>
  );
};

export default Search;