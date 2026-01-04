import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function OperationsDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Operations Dashboard</h1>
        <p className="text-gray-500 text-sm">Event execution and task management center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Events Today</h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Audits</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Operational Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate("/tasks")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>✅ View My Tasks</span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate("/events")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>📋 Event Function Sheets</span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate("/audits")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
              <span>🔍 Conduct Audit</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}