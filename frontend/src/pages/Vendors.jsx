import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddVendorModal from "../components/AddVendorModal";

export default function Vendors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendors, setVendors] = useState([
    { id: 1, name: "Sharma Flowers", category: "Florist", phone: "9876543210", status: "Active" },
    { id: 2, name: "DJ Rockers", category: "Sound/DJ", phone: "9123456789", status: "Active" },
    { id: 3, name: "Elegant Decors", category: "Decorator", phone: "9988776655", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === data.id ? data : v));
    } else {
      setVendors([...vendors, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  const openEdit = (vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vendor Master</h1>
          <p className="text-gray-500 text-sm">Manage external suppliers and partners.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                <td className="px-6 py-4">{vendor.category}</td>
                <td className="px-6 py-4">{vendor.phone}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{vendor.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(vendor)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddVendorModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingVendor={editingVendor} />}
    </AdminLayout>
  );
}