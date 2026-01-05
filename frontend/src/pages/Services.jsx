import { useState, useEffect } from "react";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem("services")) || [
      { id: 1, name: "DJ & Sound System", cost: 15000, unit: "per event" },
      { id: 2, name: "Projector & Screen", cost: 5000, unit: "per event" },
      { id: 3, name: "Special Floral Decor", cost: 25000, unit: "per event" },
      { id: 4, name: "Live Music Band", cost: 50000, unit: "per event" }
    ];
    setServices(savedServices);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add-on Services</h1>
        <p className="text-gray-500 text-sm">Manage additional services offered for events.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4">₹{service.cost.toLocaleString()}</td>
                <td className="px-6 py-4">{service.unit}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">No add-on services defined.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}