import { useState, useEffect } from "react";

export default function Roles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("roles")) || [
        { id: 1, name: "Sales Manager", department: "Sales" },
        { id: 2, name: "Event Operations Manager", department: "Operations" },
        { id: 3, name: "F&B Manager", department: "F&B Service" },
        { id: 4, name: "Kitchen Head", department: "F&B Production" },
    ];
    setRoles(saved);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm">Define user roles within the organization.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Role Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                <td className="px-6 py-4">{r.department}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Manage Permissions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}