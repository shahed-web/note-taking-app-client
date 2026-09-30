import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Checking session...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;