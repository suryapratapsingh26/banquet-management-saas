import React from "react";

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Asyncotel Platform Admin</h1>
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Total Tenants</h3>
            <p className="text-4xl font-bold mt-2">12</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Active Subscriptions</h3>
            <p className="text-4xl font-bold mt-2 text-green-400">8</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm">Monthly Revenue</h3>
            <p className="text-4xl font-bold mt-2 text-blue-400">$4,200</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Signups</h2>
          <div className="text-gray-400 text-sm">
            <p className="py-2 border-b border-gray-700">Grand Palace Hotel (Pro Plan) - 2 mins ago</p>
            <p className="py-2 border-b border-gray-700">Royal Weddings Inc. (Starter Plan) - 4 hours ago</p>
            <p className="py-2">City Convention Center (Enterprise) - 1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}