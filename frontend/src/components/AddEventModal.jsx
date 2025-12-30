import { useState, useEffect } from "react";

export default function AddEventModal({ onClose, onSave, existingEvent }) {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "Wedding",
    hall: "Crystal Ballroom",
    timeSlot: "Morning Shift",
    date: "",
    pax: "",
    clientName: "",
    status: "Draft"
  });

  // Mock Data (In a real app, these would come from your API/Context based on Phase 1 Masters)
  const eventTypes = ["Wedding", "Corporate", "Birthday", "Engagement"];
  const halls = ["Crystal Ballroom", "Grand Hall", "Garden Area"];
  const timeSlots = ["Morning Shift (09:00 - 14:00)", "Evening Shift (18:00 - 23:00)", "Full Day"];
  const statuses = ["Draft", "Confirmed", "Ready", "Live", "Closed"];

  useEffect(() => {
    if (existingEvent) {
      setFormData(existingEvent);
    }
  }, [existingEvent]);

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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {existingEvent ? "Edit Event" : "Create New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Name</label>
              <input name="eventName" type="text" value={formData.eventName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Rohit & Priya Wedding" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <input name="clientName" type="text" value={formData.clientName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Rohit Sharma" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guest Count (Pax)</label>
              <input name="pax" type="number" value={formData.pax} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="300" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Hall</label>
              <select name="hall" value={formData.hall} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {halls.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Time Slot</label>
              <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-2">
             <label className="block text-sm font-medium text-gray-700">Status</label>
             <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">{existingEvent ? "Update Event" : "Create Event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}