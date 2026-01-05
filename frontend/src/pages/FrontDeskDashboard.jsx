import React from "react";
import { useNavigate } from "react-router-dom";

export default function FrontDeskDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Front Desk</h1>
        <p className="text-gray-500 text-sm">Manage walk-ins, enquiries, and guest arrivals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate("/leads")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>📝 Register New Enquiry</span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate("/calendar")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>📅 Check Venue Availability</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Today's Events</h3>
          <p className="text-gray-500">No events scheduled for today.</p>
        </div>
      </div>
    </>
  );
}