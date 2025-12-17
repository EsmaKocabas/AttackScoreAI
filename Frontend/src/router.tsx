import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/adminDashboard";
import { AdminGuard } from "./hooks/useAdminGuard";
import Fixtures from "./pages/Fixtures";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/fixtures" element={<Fixtures />} /> 
      <Route path="/players" element={<Players />} />
      <Route path="/players/:id" element={<PlayerDetail />} />
      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        }
      />
    </Routes>
  );
}
