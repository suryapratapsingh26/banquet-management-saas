import React from "react";

export default function FBDashboard() {
  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">F&B Dashboard</h1>
        <p className="text-gray-500 text-sm">Menu management, pax, and wastage control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Menu Lock Status</h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">Locked</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Pax Today</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">150</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Wastage</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">4%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded">🔒 Lock Menu</button>
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded">📈 Generate Menu Report</button>
        </div>
      </div>
    </div>
  );
}
