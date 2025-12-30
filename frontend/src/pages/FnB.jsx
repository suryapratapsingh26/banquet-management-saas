import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function FnB() {
  const [activeTab, setActiveTab] = useState("menus");

  const menus = [
    { id: 1, name: "Gold Wedding Package", items: 12, cost: "₹850/pax", status: "Active" },
    { id: 2, name: "Corporate High Tea", items: 6, cost: "₹450/pax", status: "Active" },
    { id: 3, name: "Premium Dinner", items: 15, cost: "₹1200/pax", status: "Draft" },
  ];

  const recipes = [
    { id: 101, name: "Paneer Butter Masala", yield: "4 Portions", cost: "₹120" },
    { id: 102, name: "Dal Makhani", yield: "5 Portions", cost: "₹90" },
    { id: 103, name: "Chicken Biryani", yield: "3 Portions", cost: "₹180" },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">F&B Management</h1>
          <p className="text-gray-500 text-sm">Menu planning, costing, and recipes.</p>
        </div>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Create New Menu
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "menus" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("menus")}
        >
          Menu Packages
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "recipes" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("recipes")}
        >
          Recipe Master
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">{activeTab === "menus" ? "Package Name" : "Recipe Name"}</th>
              <th className="px-6 py-3">{activeTab === "menus" ? "No. of Items" : "Yield"}</th>
              <th className="px-6 py-3">Cost</th>
              {activeTab === "menus" && <th className="px-6 py-3">Status</th>}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "menus" ? menus : recipes).map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4">{activeTab === "menus" ? item.items : item.yield}</td>
                <td className="px-6 py-4">{item.cost}</td>
                {activeTab === "menus" && (
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {item.status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(activeTab === "menus" ? menus : recipes).length === 0 && (
          <div className="p-6 text-center text-gray-400">No items found.</div>
        )}
      </div>
    </AdminLayout>
  );
}