import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("stock");

  const stockData = [
    { id: 1, item: "Basmati Rice", category: "Grains", stock: "50 kg", reorder: "10 kg", status: "Good" },
    { id: 2, item: "Cooking Oil", category: "Essentials", stock: "12 L", reorder: "20 L", status: "Low" },
    { id: 3, item: "Paneer", category: "Dairy", stock: "5 kg", reorder: "5 kg", status: "Critical" },
  ];

  const vendors = [
    { id: 101, name: "Fresh Farms Ltd", category: "Vegetables", contact: "9876543210" },
    { id: 102, name: "Dairy Best", category: "Milk & Dairy", contact: "9123456789" },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory & Store</h1>
          <p className="text-gray-500 text-sm">Manage stock levels, procurement, and vendors.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Purchase Order
          </button>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
            + Add Stock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "stock" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("stock")}
        >
          Stock Ledger
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "vendors" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("vendors")}
        >
          Vendors
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">{activeTab === "stock" ? "Item Name" : "Vendor Name"}</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">{activeTab === "stock" ? "Current Stock" : "Contact"}</th>
              {activeTab === "stock" && <th className="px-6 py-3">Status</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "stock" ? stockData : vendors).map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{activeTab === "stock" ? item.item : item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{activeTab === "stock" ? item.stock : item.contact}</td>
                {activeTab === "stock" && (
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === "Good" ? "bg-green-100 text-green-800" : item.status === "Low" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                      {item.status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}