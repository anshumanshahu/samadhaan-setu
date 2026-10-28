import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages that need a logged-in user. Others get sent to /login and
// come back here automatically after logging in.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;