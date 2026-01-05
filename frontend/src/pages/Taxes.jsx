import { useState, useEffect } from "react";

export default function Taxes() {
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("taxes")) || [
        { id: 1, name: "GST", rate: 5, isDefault: true },
        { id: 2, name: "Luxury Tax", rate: 12, isDefault: false },
        { id: 3, name: "Service Charge", rate: 10, isDefault: false },
    ];
    setTaxes(saved);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tax Settings</h1>
        <p className="text-gray-500 text-sm">Manage tax slabs for billing.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Tax Name</th>
              <th className="px-6 py-3">Rate (%)</th>
              <th className="px-6 py-3">Default</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                <td className="px-6 py-4">{t.rate}%</td>
                <td className="px-6 py-4">{t.isDefault ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}