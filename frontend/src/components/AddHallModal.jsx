import { useState, useEffect } from "react";

export default function AddHallModal({ onClose, onSaveHall, existingHall }) {
  const [hallData, setHallData] = useState({
    name: "",
    capacity: "",
    floor: "",
    type: "Indoor"
  });

  const handleChange = (e) => {
    setHallData({ ...hallData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveHall(hallData);
    onClose();
  };

  useEffect(() => {
    if (existingHall) {
      setHallData(existingHall);
    }
  }, [existingHall]);

  const isEditing = !!existingHall;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {isEditing ? "Edit Banquet Hall" : "Add New Banquet Hall"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hall Name</label>
            <input name="name" type="text" value={hallData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Crystal Ballroom" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input name="capacity" type="number" value={hallData.capacity} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="300" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Floor</label>
              <input name="floor" type="text" value={hallData.floor} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="Lobby Level" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select name="type" value={hallData.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">
              {isEditing ? "Update Hall" : "Save Hall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}