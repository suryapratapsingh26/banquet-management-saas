import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || !token) return;
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setDashboardData(await res.json());
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, [user, token]);

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
  if (!dashboardData) return <div className="p-8 text-center">Error loading dashboard.</div>;

  const { role, widgets } = dashboardData;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user.name} ({role})</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, idx) => (
          <Widget key={idx} widget={widget} />
        ))}
      </div>
    </div>
  );
}

function Widget({ widget }) {
  if (widget.type === 'STATS') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2 lg:col-span-3">
        <h3 className="font-bold text-gray-800 mb-4">{widget.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(widget.data).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-xl font-bold text-pink-600">{typeof value === 'number' && key.toLowerCase().includes('revenue') ? `₹${value.toLocaleString()}` : value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (widget.type === 'QUICK_ACTIONS') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {widget.actions.map(action => (
            <button key={action} className="px-3 py-2 bg-pink-50 text-pink-700 rounded text-sm font-medium hover:bg-pink-100 transition">
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (widget.type === 'LIST' || widget.type === 'TASK_LIST') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
        <h3 className="font-bold text-gray-800 mb-4">{widget.title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                {widget.type === 'TASK_LIST' && <th className="px-4 py-2">Priority</th>}
              </tr>
            </thead>
            <tbody>
              {widget.data.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  {widget.type === 'TASK_LIST' && <td className="px-4 py-2">{item.priority}</td>}
                </tr>
              ))}
              {widget.data.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No items found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-gray-500">{widget.message || JSON.stringify(widget)}</p>
    </div>
  );
}