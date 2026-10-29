import { useCallback, useEffect, useState } from "react";

// Gets the user's current GPS position + a readable address.
// Pass autoStart=false to wait until you need it.
export function useCurrentLocation(autoStart = true) {
  const [location, setLocation] = useState(null); // { latitude, longitude, accuracy, address, city }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        let address = "";
        let city = "";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1&zoom=18&accept-language=en`
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            city = a.city || a.town || a.municipality || a.village || "";
            address = data.display_name || "";
          }
        } catch {
          // address lookup failed: coordinates alone are still saved
        }

        setLocation({ latitude, longitude, accuracy, address, city });
        setLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Please allow location access to submit your complaint.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Your location is currently unavailable.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location detection timed out. Please try again.");
        } else {
          setError("Unable to detect your location.");
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (autoStart) refresh();
  }, [autoStart, refresh]);

  return { location, loading, error, refresh };
}