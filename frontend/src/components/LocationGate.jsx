import { useEffect, useState } from "react";

// Major Indian cities currently supported — add/remove as the platform expands
const SUPPORTED_CITIES = [
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
];

const MAX_DISTANCE_KM = 30; // radius around each city center

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Returns the nearest supported city if the user is within range, else null
function findNearestSupportedCity(lat, lng) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const city of SUPPORTED_CITIES) {
    const distance = getDistanceKm(lat, lng, city.lat, city.lng);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = city;
    }
  }

  return nearestDistance <= MAX_DISTANCE_KM ? nearest : null;
}

const LocationGate = ({ children }) => {
  // checking | allowed | outside | denied | unsupported
  const [status, setStatus] = useState("checking");

  function checkLocation() {
    setStatus("checking");

    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const city = findNearestSupportedCity(latitude, longitude);
        setStatus(city ? "allowed" : "outside");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => {
    checkLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "allowed") return children;

  return (
    <div className="fixed inset-0 z-[100] bg-brand-green/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-7 text-center">
        {status === "checking" && (
          <>
            <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Checking your location
            </h3>
            <p className="text-sm text-gray-500">
              Please allow location access when your browser asks.
            </p>
          </>
        )}

        {status === "denied" && (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">
              Location access needed
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Samadhaan Setu currently works in select Indian cities. Please
              allow location access in your browser to continue.
            </p>
            <button
              onClick={checkLocation}
              className="bg-brand-green text-white text-sm font-medium px-6 py-2.5 rounded-full"
            >
              Allow Location
            </button>
          </>
        )}

        {status === "outside" && (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">
              Not available in your area yet
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Samadhaan Setu is currently live in{" "}
              {SUPPORTED_CITIES.map((c) => c.name).join(", ")}. We're
              expanding to more cities soon.
            </p>
            <button
              onClick={checkLocation}
              className="bg-brand-green text-white text-sm font-medium px-6 py-2.5 rounded-full"
            >
              Check Again
            </button>
          </>
        )}

        {status === "unsupported" && (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">
              Location not supported
            </h3>
            <p className="text-sm text-gray-500">
              Your browser doesn't support location detection. Please try a
              different browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationGate;