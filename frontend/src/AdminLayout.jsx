import { Outlet } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function AdminLayout({ role = "admin" }) {
  // Define navigation items based on role
  const navItems = {
    admin: [
      "Dashboard",
      "Banquet Masters",
      "Sales",
      "Events",
      "Reports",
      "Settings"
    ],
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

  const currentNav = navItems[role] || navItems.admin;
  const roleLabel = role === "event-company" ? "Event Co." : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <FaBars className="text-gray-600 cursor-pointer" />
          <h1 className="font-bold text-xl text-blue-900">Asyncotel</h1>
        </div>
        <div className="flex items-center gap-4">
          <FaBell className="text-gray-600" />
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-gray-600 text-2xl" />
            <span className="text-sm font-medium capitalize">{roleLabel}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}