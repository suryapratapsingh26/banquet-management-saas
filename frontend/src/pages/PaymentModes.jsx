import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddPaymentModeModal from "../components/AddPaymentModeModal";

export default function PaymentModes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const [modes, setModes] = useState([
    { id: 1, name: "Cash", type: "Cash", status: "Active" },
    { id: 2, name: "HDFC Bank Transfer", type: "Bank Transfer", status: "Active" },
    { id: 3, name: "PhonePe / GPay", type: "UPI/Digital", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingMode) {
      setModes(modes.map(m => m.id === data.id ? data : m));
    } else {
      setModes([...modes, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setModes(modes.filter(m => m.id !== id));
  };

  const openEdit = (mode) => {
    setEditingMode(mode);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingMode(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Mode Master</h1>
          <p className="text-gray-500 text-sm">Configure accepted payment methods.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Payment Mode
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Mode Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((mode) => (
              <tr key={mode.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{mode.name}</td>
                <td className="px-6 py-4">{mode.type}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{mode.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(mode)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(mode.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddPaymentModeModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingMode={editingMode} />}
    </AdminLayout>
  );
}