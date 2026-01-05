import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Reports({ title }) {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState({ total: 0, paid: 0, pending: 0 });
  const [leadData, setLeadData] = useState({ total: 0, converted: 0, lost: 0, conversionRate: 0 });
  const [topEvents, setTopEvents] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/reports/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRevenueData(data.revenue);
          setLeadData(data.leads);
          setTopEvents(data.topEvents);
        }
      } catch (error) { console.error(error); }
    };
    fetchReports();
  }, [user]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {title === "Dashboard" ? `Welcome, ${user?.name?.split(' ')[0] || 'User'} 👋` : (title || "Reports & Analytics")}
        </h1>
        <p className="text-gray-500 text-sm">Key metrics and performance overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹{revenueData.total.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">₹{revenueData.paid.toLocaleString()} Collected</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Lead Conversion Rate</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{leadData.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{leadData.converted} of {leadData.total} leads converted</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
          <p className="text-xs text-gray-500 mt-1">In the next 30 days</p>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Funnel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Sales Funnel</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Inquiries</span>
              <span className="font-bold text-gray-800">{leadData.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-gray-600">Converted to Event</span>
              <span className="font-bold text-green-600">{leadData.converted}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${leadData.conversionRate}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-gray-600">Leads Lost</span>
              <span className="font-bold text-red-600">{leadData.lost}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${leadData.total > 0 ? (leadData.lost / leadData.total) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Top Events by Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Top 5 Events by Revenue</h3>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Event Name</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map(event => (
                <tr key={event.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{event.eventName}</td>
                  <td className="px-4 py-3">₹{event.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${event.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}