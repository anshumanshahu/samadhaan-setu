import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchImageBlobUrl } from "../services/api";

// Shows a private complaint photo (needs the login token to load)
const AuthImage = ({ complaintId, alt, className = "" }) => {
  const { token } = useAuth();
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let url = "";
    let cancelled = false;

    fetchImageBlobUrl(complaintId, token)
      .then((u) => {
        if (cancelled) URL.revokeObjectURL(u);
        else {
          url = u;
          setSrc(u);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [complaintId, token]);

  if (failed) {
    return (
      <div className={`bg-gray-100 text-gray-400 text-xs flex items-center justify-center ${className}`}>
        No image
      </div>
    );
  }
  if (!src) return <div className={`bg-gray-100 animate-pulse ${className}`} />;
  return <img src={src} alt={alt} className={className} />;
};

export default AuthImage;