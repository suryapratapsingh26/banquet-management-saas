import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddEventTypeModal from "../components/AddEventTypeModal";

export default function EventTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [eventTypes, setEventTypes] = useState([
    { id: 1, name: "Wedding", description: "Full wedding ceremony and reception", status: "Active" },
    { id: 2, name: "Corporate", description: "Seminars, conferences, and meetings", status: "Active" },
    { id: 3, name: "Birthday", description: "Private birthday parties", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingType) {
      setEventTypes(eventTypes.map(t => t.id === data.id ? data : t));
    } else {
      setEventTypes([...eventTypes, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setEventTypes(eventTypes.filter(t => t.id !== id));
  };

  const openEdit = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Type Master</h1>
          <p className="text-gray-500 text-sm">Categorize events for better reporting and management.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Event Type
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.map((type) => (
              <tr key={type.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{type.name}</td>
                <td className="px-6 py-4">{type.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {type.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(type)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(type.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {eventTypes.length === 0 && <div className="p-6 text-center text-gray-400">No event types found.</div>}
      </div>

      {isModalOpen && <AddEventTypeModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingType={editingType} />}
    </AdminLayout>
  );
}