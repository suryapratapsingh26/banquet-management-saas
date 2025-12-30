import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddPackageModal from "../components/AddPackageModal";

export default function Packages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packages, setPackages] = useState([
    { id: 1, name: "Silver Package", price: "600", description: "1 Starter, 2 Mains, Rice, Bread, 1 Dessert", status: "Active" },
    { id: 2, name: "Gold Package", price: "850", description: "3 Starters, 4 Mains, Rice, Bread, 2 Desserts", status: "Active" },
    { id: 3, name: "Platinum Package", price: "1200", description: "Unlimited Starters, 6 Mains, Live Counter, 3 Desserts", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === data.id ? data : p));
    } else {
      setPackages([...packages, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Package Master</h1>
          <p className="text-gray-500 text-sm">Define standard food packages and pricing.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Package
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Package Name</th>
              <th className="px-6 py-3">Price (Per Plate)</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
                <td className="px-6 py-4">₹{pkg.price}</td>
                <td className="px-6 py-4 truncate max-w-xs">{pkg.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{pkg.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(pkg)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddPackageModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingPackage={editingPackage} />}
    </AdminLayout>
  );
}