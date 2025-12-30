import { useState, useEffect } from "react";

export default function AddEventTypeModal({ onClose, onSave, existingType }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    if (existingType) {
      setFormData(existingType);
    }
  }, [existingType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {existingType ? "Edit Event Type" : "Add New Event Type"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Type Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Wedding Reception" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 p-2 border rounded" rows="3" placeholder="Optional description..." />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">
              {existingType ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}