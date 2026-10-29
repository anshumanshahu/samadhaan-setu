import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// <ProtectedRoute>            -> any logged-in user
// <ProtectedRoute role="admin"> -> admins only (the backend checks this again)
const ProtectedRoute = ({ children, role }) => {
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

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;