import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function TimeSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/masters/timeslots`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setSlots(data);
        } else {
          setSlots([]);
        }
      } catch (e) {
        console.error(e);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Time Slots</h1>
        <p className="text-gray-500 text-sm">Manage the available time slots for bookings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading time slots...</div>
        ) : (
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
        )}
      </div>
    </>
  );
}