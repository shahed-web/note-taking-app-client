import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <p>Checking permissions...</p>;
  }

  if (auth.user?.role !== "admin") {
    return <Navigate to="/notes" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;