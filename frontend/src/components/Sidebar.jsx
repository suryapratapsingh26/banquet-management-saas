import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-2xl font-bold text-pink-600">Asyncotel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Common Link */}
          <SidebarLink to={role === 'super_admin' ? "/super-admin-dashboard" : "/dashboard"} icon="📊" text="Dashboard" />

          {/* Admin-only Links */}
          {role === 'admin' && (
            <>
              <SidebarLink to="/leads" icon="🎯" text="Leads & CRM" />
              <SidebarLink to="/sales" icon="📈" text="Sales Dashboard" />
              <SidebarLink to="/coordination" icon="🤝" text="Team Coordination" />
              <SidebarLink to="/events" icon="📅" text="Events" />
              <SidebarLink to="/banquet-halls" icon="🏢" text="Banquet Halls" />
              <SidebarLink to="/time-slots" icon="⏰" text="Time Slots" />
              <SidebarLink to="/event-types" icon="🎉" text="Event Types" />
              <SidebarLink to="/fnb" icon="🍽️" text="F&B Management" />
              <SidebarLink to="/menu-items" icon="🥗" text="Menu Items" />
              <SidebarLink to="/packages" icon="🍱" text="Packages" />
              <SidebarLink to="/services" icon="🎤" text="Add-On Services" />
              <SidebarLink to="/taxes" icon="🧾" text="Tax Master" />
              <SidebarLink to="/payment-modes" icon="💳" text="Payment Modes" />
              <SidebarLink to="/inventory" icon="📦" text="Inventory & Store" />
              <SidebarLink to="/vendors" icon="🤝" text="Vendors" />
              <SidebarLink to="/departments" icon="🏷️" text="Departments" />
              <SidebarLink to="/roles" icon="👥" text="Team & Roles" />
              <SidebarLink to="#" icon="💰" text="Billing & Accounts" />
              <SidebarLink to="#" icon="📈" text="Reports" />
            </>
          )}

          {/* Super Admin Links */}
          {role === 'super_admin' && (
            <>
              <SidebarLink to="#" icon="🏢" text="Tenant Management" />
              <SidebarLink to="#" icon="💳" text="Subscriptions" />
              <SidebarLink to="#" icon="📈" text="Global Reports" />
            </>
          )}

          {/* Common Link */}
          <SidebarLink to="/settings" icon="⚙️" text="Settings" />
        </ul>
      </nav>

      <div className="p-4 border-t text-xs text-gray-400 text-center">© 2025 Asyncotel</div>
    </aside>
  );
}

const SidebarLink = ({ to, icon, text }) => (
  <li>
    <Link to={to} className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
      {icon} {text}
    </Link>
  </li>
);