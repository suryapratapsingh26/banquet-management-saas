import { useParams, Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data - In real app, fetch event by ID
  const event = {
    id: id,
    eventName: "Rohit & Priya Wedding",
    date: "2023-11-15",
    status: "Confirmed",
    client: "Rohit Sharma"
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/events" className="hover:text-pink-600">Events</Link>
            <span>/</span>
            <span>{event.eventName}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{event.eventName}</h1>
        </div>
        <div className="flex gap-3">
           <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium self-center">
             {event.status}
           </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["Overview", "Food & Beverage", "Services & Decor", "Billing", "Function Sheet"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.toLowerCase()
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400">
        Content for {activeTab.toUpperCase()} will go here.
      </div>
    </AdminLayout>
  );
}