import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPlus, FaLocationArrow } from "react-icons/fa";

const Search = () => {
  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        address: "Geolocation is not supported by this browser",
      }));
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Save exact GPS coordinates
        setLocation({
          address: "Finding your exact location...",
          latitude,
          longitude,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Unable to fetch address");
          }

          const data = await response.json();
          const address = data.address || {};

          /*
            Build the most detailed readable address possible
          */

          const houseNumber = address.house_number || "";
          const road =
            address.road ||
            address.pedestrian ||
            address.footway ||
            address.path ||
            "";

          const neighbourhood =
            address.neighbourhood ||
            address.residential ||
            "";

          const suburb =
            address.suburb ||
            address.subdistrict ||
            "";

          const cityDistrict =
            address.city_district ||
            address.district ||
            "";

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "";

          const state = address.state || "";

          const postcode = address.postcode || "";

          // Create detailed address
          const parts = [
            houseNumber && road
              ? `${houseNumber} ${road}`
              : road,
            neighbourhood,
            suburb,
            cityDistrict,
            city,
            state,
            postcode,
          ].filter(Boolean);

          // Remove duplicate values
          const uniqueParts = [...new Set(parts)];

          const fullAddress =
            uniqueParts.length > 0
              ? uniqueParts.join(", ")
              : data.display_name || "Current Location";

          setLocation({
            address: fullAddress,
            latitude,
            longitude,
          });
        } catch (error) {
          console.error("Reverse geocoding error:", error);

          setLocation({
            address: "Address unavailable",
            latitude,
            longitude,
          });
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.error("Location error:", error);

        let message = "Unable to detect location";

        if (error.code === error.PERMISSION_DENIED) {
          message = "Please allow location access";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information unavailable";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out";
        }

        setLocation({
          address: message,
          latitude: null,
          longitude: null,
        });

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  // Automatically detect location when page loads
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location.latitude || !location.longitude) {
      alert("Please allow location access first.");
      return;
    }

    console.log("Report Location:", {
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    /*
      Example:

      navigate(
        `/report?address=${encodeURIComponent(
          location.address
        )}&lat=${location.latitude}&lng=${location.longitude}`
      );
    */
  };

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
        {/* LOCATION */}
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
          {/* Icon */}
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

          {/* Address */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
              Precise Location
            </p>

            <p
              className="
                mt-0.5
                text-xs sm:text-sm
                text-gray-700
                font-medium
                leading-5
              "
              title={location.address}
            >
              {location.address || "Detecting your location..."}
            </p>

            {/* Coordinates */}
            {location.latitude && location.longitude && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </p>
            )}
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
              className={`text-xs ${
                loading ? "animate-spin" : ""
              }`}
            />

            <span className="hidden sm:inline text-xs font-semibold">
              {loading ? "Detecting..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* REPORT ISSUE */}
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
            text-sm sm:text-base
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