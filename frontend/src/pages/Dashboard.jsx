import AdminLayout from "../layouts/AdminLayout";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-500">Here is what's happening in your banquet hall today.</p>
        </div>
        <button 
          onClick={() => navigate("/leads")}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition"
        >
          + New Booking
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Events" value="12" btn="View Calendar" color="pink" />
        <StatCard title="Monthly Revenue" value="₹18,50,000" btn="View Reports" color="purple" />
        <StatCard title="Leads" value="34" btn="View Pipeline" color="pink" />
        <StatCard title="Profit" value="32%" btn="View Analytics" color="purple" />
      </div>

      {/* Middle Section: Charts & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BookingOverview />
        <RevenueStats />
        <TasksAlerts />
      </div>

      {/* Bottom Section: Quick Actions & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <UpcomingEvents />
      </div>
    </AdminLayout>
  );
}

/* --- Local Components for Dashboard Widgets --- */

function StatCard({ title, value, btn, color }) {
  const btnColor = color === 'pink' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-purple-500 hover:bg-purple-600';
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 my-2">{value}</h2>
      </div>
      <button className={`text-xs text-white px-3 py-1.5 rounded self-start ${btnColor} transition`}>
        {btn}
      </button>
    </div>
  );
}

function BookingOverview() {
  const data = [
    { name: "Week 1", confirmed: 24, tentative: 12, cancelled: 5 },
    { name: "Week 2", confirmed: 30, tentative: 15, cancelled: 4 },
    { name: "Week 3", confirmed: 42, tentative: 18, cancelled: 6 },
    { name: "Week 4", confirmed: 55, tentative: 20, cancelled: 8 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Booking Overview</h3>

        <select className="text-sm border rounded px-2 py-1 text-gray-600">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area
              type="monotone"
              dataKey="confirmed"
              stackId="1"
              stroke="#16a34a"
              fill="#86efac"
            />
            <Area
              type="monotone"
              dataKey="tentative"
              stackId="1"
              stroke="#f97316"
              fill="#fdba74"
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              stackId="1"
              stroke="#ef4444"
              fill="#fca5a5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RevenueStats() {
  const data = [
    { name: "Jan", revenue: 400000 },
    { name: "Feb", revenue: 300000 },
    { name: "Mar", revenue: 550000 },
    { name: "Apr", revenue: 450000 },
    { name: "May", revenue: 700000 },
    { name: "Jun", revenue: 600000 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Revenue Stats</h3>
        <button className="text-pink-600 text-xs font-semibold hover:underline">View Report</button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
            <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [`₹${value}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TasksAlerts() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-3">Tasks & Alerts</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2"><span className="text-green-500">✅</span> Payment Reminder: Kapoor Reception</li>
        <li className="flex items-start gap-2"><span className="text-yellow-500">⚠️</span> Inventory Low: Beverage Stock</li>
        <li className="flex items-start gap-2"><span className="text-red-500">⏳</span> Staff Assignment Pending</li>
        <li className="flex items-start gap-2"><span className="text-blue-500">📞</span> Follow up on New Leads</li>
      </ul>
    </div>
  );
}

function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-pink-50 text-pink-600 rounded hover:bg-pink-100 text-sm font-medium">Create Invoice</button>
        <button className="p-3 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 text-sm font-medium">Add Staff</button>
        <button onClick={() => navigate("/calendar")} className="p-3 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium">Check Availability</button>
        <button className="p-3 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium">Vendor List</button>
      </div>
    </div>
  );
}

function UpcomingEvents() {
  return (
    <div className="col-span-1 lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-4">Upcoming Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-900">Sharma Wedding</td>
              <td className="px-4 py-3">Oct 24, 2025</td>
              <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Confirmed</span></td>
              <td className="px-4 py-3">₹4,50,000</td>
              <td className="px-4 py-3 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3">View</button>
                <button className="text-gray-500 hover:text-gray-700 text-xs font-medium">Edit</button>
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-900">Tech Corp Seminar</td>
              <td className="px-4 py-3">Oct 26, 2025</td>
              <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span></td>
              <td className="px-4 py-3">₹1,20,000</td>
              <td className="px-4 py-3 text-right">
                <button className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3">View</button>
                <button className="text-gray-500 hover:text-gray-700 text-xs font-medium">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}