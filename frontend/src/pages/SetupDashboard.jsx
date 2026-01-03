import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminLayout from "../layouts/AdminLayout";

export default function SetupDashboard() {
  const { user, login } = useAuth();

  // In a real app, these would be checked against the DB/API
  const checklist = [
    { label: "Property Details", isDone: true, link: "/settings" }, // Done via Signup
    { label: "Banquet Halls", isDone: false, link: "/banquet-halls" },
    { label: "Time Slots", isDone: false, link: "/time-slots" },
    { label: "Departments & Roles", isDone: false, link: "/departments" },
    { label: "Packages & Pricing", isDone: false, link: "/packages" },
    { label: "Team Members", isDone: false, link: "/users" },
  ];

  const handleCompleteSetup = () => {
    // Demo: Manually upgrade user to Active state
    const updatedUser = { ...user, isSetupComplete: true };
    login(updatedUser);
    window.location.reload(); // Refresh to trigger the Dashboard switch
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
          <p className="text-gray-500 mt-2">Let’s set up your banquet system before we go live.</p>
        </div>

        {/* Main Setup Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Setup Progress</h2>
            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">SETUP PENDING</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {checklist.map((item, idx) => (
                <Link key={idx} to={item.link} className="flex items-center p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${item.isDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {item.isDone ? '✓' : '○'}
                  </div>
                  <span className={`text-sm font-medium ${item.isDone ? 'text-gray-800' : 'text-gray-500 group-hover:text-pink-600'}`}>
                    {item.label}
                  </span>
                  {!item.isDone && <span className="ml-auto text-xs text-pink-600 opacity-0 group-hover:opacity-100">Configure →</span>}
                </Link>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-800 mb-2">Ready to Go Live?</h3>
              <p className="text-xs text-gray-500 mb-4">Once you have configured your halls and pricing, click below to unlock the full dashboard.</p>
              <button onClick={handleCompleteSetup} className="bg-gray-900 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition text-sm font-medium cursor-pointer">
                Finish Setup & Unlock Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/settings" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold text-gray-700">Set up Property</div>
          </Link>
          <Link to="/banquet-halls" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="font-semibold text-gray-700">Add Banquet Hall</div>
          </Link>
          <Link to="/time-slots" className="bg-white p-4 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="font-semibold text-gray-700">Configure Time Slots</div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}