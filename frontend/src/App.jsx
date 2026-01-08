import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import DashboardRouter from "./pages/DashboardRouter";
import Leads from "./pages/Leads";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Quotations from "./pages/Quotations";
import Tasks from "./pages/Tasks";
import StaffSchedule from "./pages/StaffSchedule";
import BanquetHalls from "./pages/BanquetHalls";
import Calendar from "./pages/Calendar";
import Menus from "./pages/Menus";
import Inventory from "./pages/Inventory";
import Vendors from "./pages/Vendors";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import TaskTemplates from "./pages/TaskTemplates";
import Kitchen from "./pages/Kitchen";
import Checklists from "./pages/Checklists";
import VendorPortal from "./pages/VendorPortal";
import Audits from "./pages/Audits";
import StaffLogin from "./pages/StaffLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/vendor-portal" element={<VendorPortal />} />
          
          {/* 
            CORRECT ROUTING: AdminLayout is mounted ONCE here.
            It uses <Outlet /> to render the child routes.
          */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/sales/leads" element={<Leads />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/operations/tasks" element={<Tasks />} />
            <Route path="/staff-schedule" element={<StaffSchedule />} />
            <Route path="/banquet-halls" element={<BanquetHalls />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/packages" element={<Menus />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/task-templates" element={<TaskTemplates />} />
            <Route path="/kitchen/dashboard" element={<Kitchen />} />
            <Route path="/accounts/dashboard" element={<Billing />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/audits" element={<Audits />} />
            <Route path="/register-property" element={<RegisterProperty />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function RegisterProperty() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Register Property</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Property registration form content goes here.</p>
      </div>
    </div>
  );
}