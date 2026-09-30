import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoute";
import Login from "./pages/login";
import Notes from "./pages/Notes";
import AdminRoute from "./routes/adminRoute";
import PublicRoute from "./routes/publicRoutes";
import AdminUsers from "./pages/admin/AdminUser";
import AdminNotes from "./pages/admin/AdminNote";
import GroupedInterests from "./pages/admin/GroupedInterest";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/notes" element={<Notes />} />

        <Route element={<AdminRoute />}>
            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />
            <Route
                path="/admin/notes"
                element={<AdminNotes />}
              />
            <Route
              path="/admin/users/interests"
              element={<GroupedInterests />}
              />
        </Route>
        
      </Route>

      <Route path="*" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}

export default App;