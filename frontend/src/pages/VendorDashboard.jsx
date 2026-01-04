import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Portal</h1>
        <p className="text-gray-500 text-sm">Manage your assigned events and tasks.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome Partner!</h3>
        <p className="text-gray-500 mb-6">You have 2 upcoming event assignments.</p>
        <button onClick={() => navigate("/tasks")} className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          View My Tasks
        </button>
      </div>
    </AdminLayout>
  );
}