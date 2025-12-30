import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.token) {
    // User not logged in
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;