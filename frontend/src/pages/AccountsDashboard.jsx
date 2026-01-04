import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AccountsDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finance & Accounts</h1>
        <p className="text-gray-500 text-sm">Invoicing, payments, and revenue tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Pending Invoices</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹4,50,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Collected This Month</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">₹12,20,000</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Finance Actions</h3>
        <div className="space-y-3">
          <button onClick={() => navigate("/billing")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
            <span>💰 Manage Invoices & Payments</span>
            <span className="text-gray-400">→</span>
          </button>
          <button onClick={() => navigate("/reports")} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded flex justify-between items-center cursor-pointer">
            <span>📊 View Financial Reports</span>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}