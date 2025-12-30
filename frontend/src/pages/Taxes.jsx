import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddTaxModal from "../components/AddTaxModal";

export default function Taxes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [taxes, setTaxes] = useState([
    { id: 1, name: "GST", percentage: "18", type: "Exclusive", status: "Active" },
    { id: 2, name: "Service Charge", percentage: "5", type: "Exclusive", status: "Active" },
    { id: 3, name: "VAT (Liquor)", percentage: "20", type: "Exclusive", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingTax) {
      setTaxes(taxes.map(t => t.id === data.id ? data : t));
    } else {
      setTaxes([...taxes, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setTaxes(taxes.filter(t => t.id !== id));
  };

  const openEdit = (tax) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingTax(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tax Master</h1>
          <p className="text-gray-500 text-sm">Manage applicable taxes and service charges.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Tax
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Tax Name</th>
              <th className="px-6 py-3">Percentage</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{tax.name}</td>
                <td className="px-6 py-4">{tax.percentage}%</td>
                <td className="px-6 py-4">{tax.type}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{tax.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(tax)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(tax.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddTaxModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingTax={editingTax} />}
    </AdminLayout>
  );
}