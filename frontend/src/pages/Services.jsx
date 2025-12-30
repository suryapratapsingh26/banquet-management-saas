import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddServiceModal from "../components/AddServiceModal";

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState([
    { id: 1, name: "DJ & Sound", price: "15000", description: "Professional DJ with JBL Sound System", status: "Active" },
    { id: 2, name: "Basic Decor", price: "25000", description: "Stage backdrop, entrance arch, table centerpieces", status: "Active" },
    { id: 3, name: "Photography", price: "30000", description: "Candid photography + 1 Album", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingService) {
      setServices(services.map(s => s.id === data.id ? data : s));
    } else {
      setServices([...services, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const openEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add-On Services Master</h1>
          <p className="text-gray-500 text-sm">Manage extra services like Decor, DJ, Photography.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Price (₹)</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4">₹{service.price}</td>
                <td className="px-6 py-4 truncate max-w-xs">{service.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{service.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(service)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddServiceModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingService={editingService} />}
    </AdminLayout>
  );
}