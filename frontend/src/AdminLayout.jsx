import { Outlet } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./components/AuthContext";

export default function AdminLayout() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";

  // Define navigation items based on role
  const navItems = {
    // Admin sidebar is now handled by the Sidebar component for full control
    "event-company": [
      "Dashboard",
      "Leads & CRM",
      "Events",
      "Banquet Halls",
      "Vendors",
      "Billing",
      "Settings"
    ],
    vendor: [
      "Dashboard",
      "Orders",
      "Deliveries",
      "Payments",
      "Profile"
    ]
  };

  // If role is admin/owner, use the new comprehensive Sidebar component
  const isAdmin = ["owner", "admin", "company_admin"].includes(role.toLowerCase());
  const currentNav = navItems[role] || [];
  const roleLabel = role === "event-company" ? "Event Co." : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        {isAdmin ? (
          <Sidebar />
        ) : (
          <aside className="w-64 bg-white shadow-md hidden md:block">
            <nav className="p-4 space-y-2 text-sm font-medium text-gray-700">
              {currentNav.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded cursor-pointer ${index === 0 ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 overflow-auto`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}