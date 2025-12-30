import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import EventCompanyDashboard from "./pages/EventCompanyDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Banquet Owner / Admin Routes */}
      <Route path="/admin" element={<AdminLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Event Management Company Routes */}
      <Route path="/event-company" element={<AdminLayout role="event-company" />}>
        <Route index element={<EventCompanyDashboard />} />
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor" element={<AdminLayout role="vendor" />}>
        <Route index element={<VendorDashboard />} />
      </Route>
    </Routes>
  );
}