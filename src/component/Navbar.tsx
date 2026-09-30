import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/notes" className="navbar-brand">
        Secure Notes
      </Link>

      <div className="navbar-links">
        <Link to="/notes" className="navbar-link">
          Notes
        </Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin/users" className="navbar-link">
              Users
            </Link>

            <Link to="/admin/notes" className="navbar-link">
              All Notes
            </Link>

            <Link to="/admin/users/interests" className="navbar-link">
              Interests
            </Link>
          </>
        )}

        <span className="navbar-user">
          {user?.name}
        </span>

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}