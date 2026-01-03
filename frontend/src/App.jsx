import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
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
import TimeSlots from "./pages/TimeSlots";
import EventTypes from "./pages/EventTypes";
import Departments from "./pages/Departments";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import Menus from "./pages/Menus";
import Packages from "./pages/Packages";
import Services from "./pages/Services";
import Taxes from "./pages/Taxes";
import PaymentModes from "./pages/PaymentModes";
import Vendors from "./pages/Vendors";
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
import SalesDashboard from "./pages/SalesDashboard";
import OperationsDashboard from "./pages/OperationsDashboard";
import FNBDashboard from "./pages/FNBDashboard";
import AccountsDashboard from "./pages/AccountsDashboard";
import VendorDashboard from "./pages/VendorDashboard";
// import FrontDeskDashboard from "./pages/FrontDeskDashboard"; // Not created yet
// import EventCoordinationDashboard from "./pages/EventCoordinationDashboard"; // Not created yet

// Smart Route Component
const DashboardRoute = () => {
  const { user } = useAuth();
  return user?.isSetupComplete ? <Dashboard /> : <SetupDashboard />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/setup" element={<ProtectedRoute><SetupOrganization /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRoute /></ProtectedRoute>} />
          <Route path="/super-admin-dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/fnb" element={<ProtectedRoute><FnB /></ProtectedRoute>} />
          <Route path="/banquet-halls" element={<ProtectedRoute><BanquetHalls /></ProtectedRoute>} />
          <Route path="/time-slots" element={<ProtectedRoute><TimeSlots /></ProtectedRoute>} />
          <Route path="/event-types" element={<ProtectedRoute><EventTypes /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/menus" element={<ProtectedRoute><Menus /></ProtectedRoute>} />
          <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/taxes" element={<ProtectedRoute><Taxes /></ProtectedRoute>} />
          <Route path="/payment-modes" element={<ProtectedRoute><PaymentModes /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/task-templates" element={<ProtectedRoute><TaskTemplates /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/audits" element={<ProtectedRoute><Audits /></ProtectedRoute>} />
          <Route path="/coordination" element={<ProtectedRoute><EventCoordinationDashboard /></ProtectedRoute>} />
          
          {/* Role-Based Dashboards (also protected) */}
          <Route path="/sales" element={<ProtectedRoute><SalesDashboard /></ProtectedRoute>} />
          <Route path="/operations" element={<ProtectedRoute><OperationsDashboard /></ProtectedRoute>} />
          <Route path="/fnb-dashboard" element={<ProtectedRoute><FNBDashboard /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsDashboard /></ProtectedRoute>} />
          {/* <Route path="/frontdesk" element={<ProtectedRoute><FrontDeskDashboard /></ProtectedRoute>} /> */}
          <Route path="/vendor" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}