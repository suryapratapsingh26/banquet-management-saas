import React from "react";
import { useNavigate } from "react-router-dom";

export default function SalesDashboard() {
  const navigate = useNavigate();
  
  // Mock Data
  const stats = [
    { label: "New Leads (This Month)", value: "12", color: "bg-blue-100 text-blue-700" },
    { label: "Pending Proposals", value: "5", color: "bg-yellow-100 text-yellow-700" },
    { label: "Confirmed Bookings", value: "3", color: "bg-green-100 text-green-700" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here is your sales pipeline overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color.split(" ")[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate("/sales/leads")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>📝 Create New Lead</span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate("/quotations")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>💼 Create Quotation</span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate("/calendar")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>📅 Check Availability</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}