import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/adminDashboard";
import ManagePlayers from "./pages/admin/ManagePlayers";
import ManagePredictions from "./pages/admin/ManagePredictions";
import ManageUsers from "./pages/admin/manageUsers";
import Prediction from "./pages/Prediction";
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
      <Route path="/prediction" element={<Prediction />} />
      {/* ADMIN */}
      <Route
        path="/admin/*"
        element={
          <AdminGuard>
            <Routes>
              <Route path="" element={<AdminDashboard />} />
              <Route path="players" element={<ManagePlayers />} />
              <Route path="predictions" element={<ManagePredictions />} />
              <Route path="users" element={<ManageUsers />} />
            </Routes>
          </AdminGuard>
        }
      />      
    </Routes>
  );
}
