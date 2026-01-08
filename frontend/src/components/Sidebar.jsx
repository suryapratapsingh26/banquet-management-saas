import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.role?.toUpperCase() || "";
  const isAdmin = ["OWNER", "ADMIN", "COMPANY_ADMIN"].includes(role);
  const isSuperAdmin = role === "SUPER_ADMIN";
  if (!isAdmin && !isSuperAdmin) return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { header: "Overview", items: [{ name: "Dashboard", path: "/admin/dashboard", icon: "🏠" }] },
    { header: "Sales & CRM", items: [ { name: "Leads", path: "/sales/leads", icon: "📊" }, { name: "Sales Pipeline", path: "/sales/pipeline", icon: "📉" }, { name: "Quotations", path: "/quotations", icon: "📝" }, { name: "Contracts", path: "/contracts", icon: "📜" } ] },
    { header: "Events", items: [ { name: "Event List", path: "/events", icon: "📅" }, { name: "Calendar View", path: "/calendar", icon: "🗓️" }, { name: "Multi-Day Events", path: "/multi-day-events", icon: "🔁" } ] },
    { header: "Venue & Scheduling", items: [ { name: "Banquet Halls", path: "/banquet-halls", icon: "🏛️" }, { name: "Time Slots", path: "/time-slots", icon: "⏱️" }, { name: "Seating Layouts", path: "/seating-layouts", icon: "🪑" }, { name: "Event Types", path: "/event-types", icon: "🏷️" } ] },
    { header: "F&B & Kitchen", items: [ { name: "Menu Builder", path: "/menus", icon: "🍽️" }, { name: "Recipe Master", path: "/recipes", icon: "🍲" }, { name: "Production Planning", path: "/kitchen/dashboard", icon: "👨‍🍳" }, { name: "Wastage Tracking", path: "/wastage", icon: "🗑️" } ] },
    { header: "Inventory & Vendors", items: [ { name: "Inventory Items", path: "/inventory", icon: "📦" }, { name: "Vendor Master", path: "/vendors", icon: "🤝" }, { name: "Vendor Performance", path: "/vendor-performance", icon: "⭐" } ] },
    { header: "Operations", items: [ { name: "Tasks", path: "/operations/tasks", icon: "🛠️" }, { name: "Checklists", path: "/checklists", icon: "✅" }, { name: "Task Templates", path: "/task-templates", icon: "📋" }, { name: "Escalations", path: "/escalations", icon: "⚠️" } ] },
    { header: "Audits", items: [ { name: "Pre-Event Audits", path: "/audits/pre", icon: "🔍" }, { name: "Post-Event Audits", path: "/audits/post", icon: "🔎" }, { name: "Damage & Wastage", path: "/audits/damage", icon: "🏚️" } ] },
    { header: "Finance & Accounts", items: [ { name: "Invoices", path: "/billing", icon: "💳" }, { name: "Payments", path: "/payments", icon: "💵" }, { name: "GST & Taxes", path: "/taxes", icon: "🧾" }, { name: "Settlements", path: "/settlements", icon: "🤝" }, { name: "Profit & Loss", path: "/pnl", icon: "📉" } ] },
    { header: "Reports & Analytics", items: [ { name: "Sales Reports", path: "/reports/sales", icon: "📈" }, { name: "Operations Reports", path: "/reports/ops", icon: "📊" }, { name: "F&B Reports", path: "/reports/fnb", icon: "🍽️" }, { name: "Finance Reports", path: "/reports/finance", icon: "💰" }, { name: "Executive KPIs", path: "/reports/executive", icon: "👔" } ] },
    { header: "System Setup", items: [ { name: "Property Setup", path: "/settings", icon: "⚙️" }, { name: "Users & Staff", path: "/users", icon: "👥" }, { name: "Roles & Permissions", path: "/roles", icon: "🔐" }, { name: "Masters", path: "/masters", icon: "🗂️" }, { name: "Integrations", path: "/integrations", icon: "🔌" }, { name: "Subscription", path: "/subscription", icon: "💳" } ] }
  ];

  // Super admin has a different platform nav
  const superNav = [
    { header: 'Platform', items: [ { name: 'Platform Dashboard', path: '/platform-dashboard', icon: '📊' }, { name: 'Tenants', path: '/tenants', icon: '🏢' }, { name: 'Create Tenant', path: '/tenants/create', icon: '➕' } ] },
    { header: 'Subscriptions', items: [ { name: 'Plans', path: '/platform/plans', icon: '💳' }, { name: 'Usage', path: '/platform/usage', icon: '📈' } ] },
    { header: 'Feature Flags', items: [ { name: 'Modules', path: '/platform/features', icon: '⚙️' } ] },
    { header: 'Users (Internal)', items: [ { name: 'Asyncotel Staff', path: '/platform/users', icon: '👥' }, { name: 'Roles & Access', path: '/platform/roles', icon: '🔐' } ] },
    { header: 'Audit & Logs', items: [ { name: 'Activity Logs', path: '/platform/logs', icon: '🧾' }, { name: 'API Logs', path: '/platform/apilogs', icon: '🔎' } ] }
  ];

  const renderNav = (sections) => (
    <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 pl-2">{section.header}</h3>
          <ul className="space-y-1">
            {section.items.map(item => (
              <li key={item.path}>
                <Link to={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-pink-600 text-white' : 'text-gray-800 hover:bg-pink-50'}`}>
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <aside className="w-64 h-screen flex-shrink-0 flex flex-col" style={{ backgroundColor: '#FCE4EC', color: '#333' }}>
      <div className="p-6 border-b" style={{ backgroundColor: '#FCE4EC' }}>
        <h2 className="text-2xl font-bold text-pink-600">Asyncotel</h2>
        <p className="text-xs text-gray-700 tracking-widest">{isSuperAdmin ? 'PLATFORM' : 'BANQUET PMS'}</p>
      </div>

      {isSuperAdmin ? renderNav(superNav) : renderNav(navItems)}

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-pink-600">{user?.name?.charAt(0)}</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate w-32" style={{ color: '#333' }}>{user?.name}</p>
            <p className="text-xs text-gray-600 truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}