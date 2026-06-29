import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role: "admin" or "user" - checks the matching independent session
const ProtectedRoute = ({ children, role }) => {
  const { user, admin } = useAuth();
  const session = role === "admin" ? admin : user;

  if (!session) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;