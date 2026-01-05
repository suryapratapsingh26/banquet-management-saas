import { useState, useEffect } from "react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("departments")) || [
      { id: 1, name: "Sales & Marketing" },
      { id: 2, name: "Operations" },
      { id: 3, name: "F&B Production (Kitchen)" },
      { id: 4, name: "F&B Service" },
      { id: 5, name: "Finance & Accounts" },
    ];
    setDepartments(saved);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <p className="text-gray-500 text-sm">Manage organizational departments.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Department Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{d.name}</td>
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