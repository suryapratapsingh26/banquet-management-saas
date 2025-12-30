import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddTimeSlotModal from "../components/AddTimeSlotModal";

export default function TimeSlots() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slots, setSlots] = useState([
    { id: 1, name: "Morning Shift", startTime: "09:00", endTime: "14:00", status: "Active" },
    { id: 2, name: "Evening Shift", startTime: "18:00", endTime: "23:00", status: "Active" },
    { id: 3, name: "Full Day", startTime: "09:00", endTime: "23:00", status: "Active" },
  ]);

  const handleSave = (slotData) => {
    if (editingSlot) {
      setSlots(slots.map(s => s.id === slotData.id ? slotData : s));
    } else {
      setSlots([...slots, { ...slotData, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const openEdit = (slot) => {
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Time Slot Master</h1>
          <p className="text-gray-500 text-sm">Define standard event timings (e.g., Lunch, Dinner).</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Time Slot
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Slot Name</th>
              <th className="px-6 py-3">Start Time</th>
              <th className="px-6 py-3">End Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{slot.name}</td>
                <td className="px-6 py-4">{slot.startTime}</td>
                <td className="px-6 py-4">{slot.endTime}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {slot.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(slot)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(slot.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {slots.length === 0 && (
          <div className="p-6 text-center text-gray-400">No time slots found.</div>
        )}
      </div>

      {isModalOpen && <AddTimeSlotModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingSlot={editingSlot} />}
    </AdminLayout>
  );
}