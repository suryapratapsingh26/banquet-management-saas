import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";
import StatCard from "../components/StatCard";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Super Admin'}.</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-900 transition">
          + Onboard New Tenant
        </button>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tenants" value="45" color="slate" />
        <StatCard title="Active Subscriptions" value="42" color="slate" />
        <StatCard title="Total Revenue (MRR)" value="₹12.5L" color="slate" />
        <StatCard title="Pending Approvals" value="3" color="red" />
      </div>

      {/* Tenant List Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Tenants</h3>
        <div className="text-sm text-gray-500 italic">
          Tenant list table will go here...
        </div>
      </div>
    </AdminLayout>
  );
}