import { useState, useEffect } from "react";

export default function EventTypes() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const savedTypes = JSON.parse(localStorage.getItem("eventTypes")) || [
      { id: 1, name: "Wedding", description: "Marriage ceremonies and receptions" },
      { id: 2, name: "Corporate", description: "Meetings, seminars, and conferences" },
      { id: 3, name: "Social", description: "Birthdays, anniversaries, and get-togethers" }
    ];
    setTypes(savedTypes);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Types</h1>
        <p className="text-gray-500 text-sm">Manage the types of events hosted at your venue.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Type Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                <td className="px-6 py-4">{t.description}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
            {types.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-400">No event types defined.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}