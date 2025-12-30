import { useState, useEffect } from "react";

export default function AddTimeSlotModal({ onClose, onSave, existingSlot }) {
  const [slotData, setSlotData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    status: "Active"
  });

  useEffect(() => {
    if (existingSlot) {
      setSlotData(existingSlot);
    }
  }, [existingSlot]);

  const handleChange = (e) => {
    setSlotData({ ...slotData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(slotData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {existingSlot ? "Edit Time Slot" : "Add New Time Slot"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Slot Name</label>
            <input name="name" type="text" value={slotData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Morning Shift" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input name="startTime" type="time" value={slotData.startTime} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input name="endTime" type="time" value={slotData.endTime} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">{existingSlot ? "Update" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}