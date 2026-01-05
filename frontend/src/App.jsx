import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Signup from "./pages/Signup";
import SetupOrganization from "./pages/SetupOrganization";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Dashboard from "./pages/Dashboard";
import SetupDashboard from "./pages/SetupDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Leads from "./pages/Leads";
import FnB from "./pages/FnB";
import Reports from "./pages/Reports";
import BanquetHalls from "./pages/BanquetHalls";
import EventTypes from "./pages/EventTypes";
import TimeSlots from "./pages/TimeSlots";
import Departments from "./pages/Departments";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import Menus from "./pages/Menus";
import Services from "./pages/Services";
import Taxes from "./pages/Taxes";
import PaymentModes from "./pages/PaymentModes";
import Vendors from "./pages/Vendors";
import Quotations from "./pages/Quotations";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import TaskTemplates from "./pages/TaskTemplates";
import Inventory from "./pages/Inventory";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Billing from "./pages/Billing";
import Audits from "./pages/Audits";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffSchedule from "./pages/StaffSchedule";
import SalesDashboard from "./pages/SalesDashboard";
import OperationsDashboard from "./pages/OperationsDashboard";
import FNBDashboard from "./pages/FNBDashboard";
import AccountsDashboard from "./pages/AccountsDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import FrontDeskDashboard from "./pages/FrontDeskDashboard";
import EventCoordinationDashboard from "./pages/EventCoordinationDashboard";

// Smart Route Component
const DashboardRoute = () => {
  const { user } = useAuth();
  return user?.isSetupComplete ? <Dashboard /> : <SetupDashboard />;
};

// Persistent Layout Component
const AppLayout = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes without AdminLayout */}
          <Route path="/setup" element={<ProtectedRoute><SetupOrganization /></ProtectedRoute>} />
          <Route path="/super-admin-dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />

          {/* Protected Routes with Persistent AdminLayout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/fnb" element={<FnB />} />
            <Route path="/banquet-halls" element={<BanquetHalls />} />
            <Route path="/time-slots" element={<TimeSlots />} />
            <Route path="/event-types" element={<EventTypes />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/menu-items" element={<Menus />} />
            <Route path="/packages" element={<Menus />} />
            <Route path="/services" element={<Services />} />
            <Route path="/taxes" element={<Taxes />} />
            <Route path="/payment-modes" element={<PaymentModes />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/task-templates" element={<TaskTemplates />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/audits" element={<Audits />} />
            <Route path="/staff-schedule" element={<StaffSchedule />} />
            <Route path="/coordination" element={<EventCoordinationDashboard />} />
            <Route path="/sales" element={<SalesDashboard />} />
            <Route path="/operations" element={<OperationsDashboard />} />
            <Route path="/fnb-dashboard" element={<FNBDashboard />} />
            <Route path="/accounts" element={<AccountsDashboard />} />
            <Route path="/frontdesk" element={<FrontDeskDashboard />} />
            <Route path="/vendor" element={<VendorDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}