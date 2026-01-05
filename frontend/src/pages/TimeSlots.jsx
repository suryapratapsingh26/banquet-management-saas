import { useState, useEffect } from "react";

export default function TimeSlots() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem("timeSlots")) || [
      { id: 1, name: "Morning", startTime: "09:00 AM", endTime: "03:00 PM" },
      { id: 2, name: "Evening", startTime: "05:00 PM", endTime: "11:00 PM" },
      { id: 3, name: "Full Day", startTime: "09:00 AM", endTime: "11:00 PM" }
    ];
    setSlots(savedSlots);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Time Slots</h1>
        <p className="text-gray-500 text-sm">Manage the available time slots for bookings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Slot Name</th>
              <th className="px-6 py-3">Start Time</th>
              <th className="px-6 py-3">End Time</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{slot.name}</td>
                <td className="px-6 py-4">{slot.startTime}</td>
                <td className="px-6 py-4">{slot.endTime}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">No time slots defined.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}