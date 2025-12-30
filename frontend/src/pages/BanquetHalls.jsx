import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddHallModal from "../components/AddHallModal";

export default function BanquetHalls() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [halls, setHalls] = useState([
    { id: 1, name: "Emerald Hall", capacity: 500, floor: "Ground Floor", type: "Indoor" },
    { id: 2, name: "Sapphire Hall", capacity: 250, floor: "First Floor", type: "Indoor" },
    { id: 3, name: "Rooftop Garden", capacity: 150, floor: "Rooftop", type: "Outdoor" },
  ]);

  const handleAddHall = (newHall) => {
    setHalls([...halls, { ...newHall, id: Date.now() }]);
  };

  const handleDeleteHall = (hallId) => {
    setHalls(halls.filter(hall => hall.id !== hallId));
  };

  const handleEditHall = (hallToEdit) => {
    setEditingHall(hallToEdit);
    setIsModalOpen(true);
  };

  const handleSaveHall = (hallData) => {
    if (editingHall) {
      // Update existing hall
      setHalls(halls.map(h => h.id === hallData.id ? hallData : h));
    } else {
      // Add new hall
      handleAddHall(hallData);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banquet Hall Master</h1>
          <p className="text-gray-500 text-sm">Manage all venues and halls in your property.</p>
        </div>
        <button
          onClick={() => {
            setEditingHall(null);
            setIsModalOpen(true);
          }}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition"
        >
          + Add New Hall
        </button>
      </div>

      {/* Hall List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Hall Name</th>
              <th className="px-6 py-3">Capacity (Max)</th>
              <th className="px-6 py-3">Floor</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall) => (
              <tr key={hall.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{hall.name}</td>
                <td className="px-6 py-4">{hall.capacity}</td>
                <td className="px-6 py-4">{hall.floor}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${hall.type === 'Indoor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {hall.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEditHall(hall)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDeleteHall(hall.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {halls.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No banquet halls found. Click "Add New Hall" to get started.
          </div>
        )}
      </div>

      {isModalOpen && <AddHallModal onClose={() => setIsModalOpen(false)} onSaveHall={handleSaveHall} existingHall={editingHall} />}
    </AdminLayout>
  );
}