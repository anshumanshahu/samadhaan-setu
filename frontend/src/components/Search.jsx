import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaLocationArrow,
  FaExclamationCircle,
  FaCopy,
} from "react-icons/fa";

// Keep this list identical to the one in LocationGate.jsx
const SUPPORTED_CITIES = [
  "nagpur",
  "mumbai",
  "pune",
  "delhi",
  "bengaluru",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "ahmedabad",
  "jaipur",
  "lucknow",
  "surat",
  "indore",
  "nashik",
];

const Search = () => {
  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  const [loading, setLoading] = useState(false);
  const [matchedCity, setMatchedCity] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setIsSupported(false);
    setMatchedCity("");
    setCopied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({
          address: "Finding your exact location...",
          latitude,
          longitude,
          accuracy,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1&zoom=18&accept-language=en`
          );

          if (!response.ok) {
            throw new Error("Unable to fetch address");
          }

          const data = await response.json();
          const address = data.address || {};

          // -----------------------------
          // SUPPORTED CITY VALIDATION
          // -----------------------------

          const countryCode = address.country_code?.toLowerCase() || "";

          const city = (
            address.city ||
            address.town ||
            address.municipality ||
            address.village ||
            ""
          ).toLowerCase();

          const district = (
            address.city_district ||
            address.district ||
            address.county ||
            ""
          ).toLowerCase();

          const state = (address.state || "").toLowerCase();

          const foundCity = SUPPORTED_CITIES.find(
            (c) => city.includes(c) || district.includes(c)
          );

          const validLocation = countryCode === "in" && Boolean(foundCity);

          if (!validLocation) {
            setIsSupported(false);
            setError(
              "Samadhaan Setu is currently available only in select Indian cities."
            );
            setLoading(false);
            return;
          }

          // Nicely capitalised city name for display
          const displayCity =
            (address.city || address.town || address.village || foundCity)
              .toString()
              .trim();

          // -----------------------------
          // DETAILED ADDRESS
          // -----------------------------

          const houseNumber = address.house_number || "";
          const houseName = address.house_name || "";
          const road =
            address.road ||
            address.pedestrian ||
            address.footway ||
            address.path ||
            "";
          const neighbourhood =
            address.neighbourhood ||
            address.quarter ||
            address.residential ||
            "";
          const suburb = address.suburb || address.subdistrict || "";
          const cityDistrict = address.city_district || address.district || "";
          const postcode = address.postcode || "";

          const parts = [
            houseName,
            houseNumber && road ? `${houseNumber} ${road}` : road,
            neighbourhood,
            suburb,
            cityDistrict,
            displayCity,
            address.state || "",
            postcode,
          ].filter(Boolean);

          const fullAddress = [...new Set(parts)].join(", ");

          setLocation({
            address: fullAddress || data.display_name || displayCity,
            latitude,
            longitude,
            accuracy,
          });

          setMatchedCity(displayCity);
          setIsSupported(true);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setError("Unable to determine your exact area.");
          setIsSupported(false);
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.error("Geolocation error:", error);
        setIsSupported(false);

        if (error.code === error.PERMISSION_DENIED) {
          setError("Please allow location access to report an issue.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError("Your location is currently unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setError("Location detection timed out. Please try again.");
        } else {
          setError("Unable to detect your location.");
        }

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const copyCoordinates = async () => {
    if (location.latitude === null || location.longitude === null) return;

    const coordinates = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;

    try {
      await navigator.clipboard.writeText(coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isSupported) {
      setError("You can report issues only from a supported city.");
      return;
    }

    const reportLocation = {
      address: location.address,
      coordinates: `${location.latitude}, ${location.longitude}`,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      city: matchedCity,
    };

    console.log("Report Location:", reportLocation);

    /*
      Navigate to report page here.
    */
  };

  const coordinates =
    location.latitude !== null && location.longitude !== null
      ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
      : "";

  return (
    <div className="w-full max-w-4xl mx-auto -mt-6 sm:-mt-8 md:-mt-10 relative z-10 px-3 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 flex flex-col gap-3"
      >
        {/* LOCATION */}
        <div className="w-full rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
              <FaMapMarkerAlt className="text-brand-green" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                Precise Location
              </p>

              <p className="mt-0.5 text-xs sm:text-sm text-gray-700 font-semibold leading-5">
                {loading
                  ? "Finding your exact location..."
                  : location.address || "Detecting location..."}
              </p>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading}
              aria-label="Refresh location"
              className="shrink-0 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg text-brand-green bg-brand-green/5 hover:bg-brand-green/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaLocationArrow className={`text-xs ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline text-xs font-semibold">
                {loading ? "Detecting..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* GPS COORDINATES */}
          {coordinates && (
            <div className="mt-3">
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
                GPS Coordinates
              </p>

              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                <code className="flex-1 min-w-0 text-xs sm:text-sm font-mono font-semibold text-gray-700 truncate">
                  {coordinates}
                </code>

                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition text-xs font-semibold"
                >
                  <FaCopy />
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}

          {/* GPS ACCURACY */}
          {location.accuracy !== null && (
            <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs text-gray-400">
              <span>GPS Accuracy</span>
              <span className="font-semibold text-gray-600">
                ±{Math.round(location.accuracy)} meters
              </span>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* REPORT ISSUE */}
        <button
          type="submit"
          disabled={!isSupported || loading}
          className="w-full min-h-[52px] flex items-center justify-center gap-2.5 bg-brand-green text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-xl hover:bg-brand-green/90 active:scale-[0.98] hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20">
            <FaPlus className="text-xs sm:text-sm" />
          </span>
          <span>
            {isSupported
              ? `Report Issue in ${matchedCity}`
              : "Supported City Required"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default Search;