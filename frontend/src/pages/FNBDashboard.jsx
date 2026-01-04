import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function FNBDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">F&B & Kitchen Dashboard</h1>
        <p className="text-gray-500 text-sm">Menu planning, production, and inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Active Menus</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">3</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Kitchen Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate("/menus")} className="p-4 bg-gray-50 hover:bg-gray-100 rounded text-center cursor-pointer">
            <div className="text-2xl mb-2">🍽️</div>
            <div className="font-medium">Menu Master</div>
          </button>
          <button onClick={() => navigate("/inventory")} className="p-4 bg-gray-50 hover:bg-gray-100 rounded text-center cursor-pointer">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium">Inventory</div>
          </button>
          <button onClick={() => navigate("/tasks")} className="p-4 bg-gray-50 hover:bg-gray-100 rounded text-center cursor-pointer">
            <div className="text-2xl mb-2">👨‍🍳</div>
            <div className="font-medium">Kitchen Tasks</div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}