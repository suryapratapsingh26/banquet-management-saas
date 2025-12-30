import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddDepartmentModal from "../components/AddDepartmentModal";

export default function Departments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [departments, setDepartments] = useState([
    { id: 1, name: "Sales & Marketing", status: "Active" },
    { id: 2, name: "Operations", status: "Active" },
    { id: 3, name: "Kitchen", status: "Active" },
    { id: 4, name: "Housekeeping", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === data.id ? data : d));
    } else {
      setDepartments([...departments, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Department Master</h1>
          <p className="text-gray-500 text-sm">Manage internal teams and departments.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Department Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{dept.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(dept)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <AddDepartmentModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingDept={editingDept} />}
    </AdminLayout>
  );
}