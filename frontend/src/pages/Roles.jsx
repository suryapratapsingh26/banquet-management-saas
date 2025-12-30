import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddRoleModal from "../components/AddRoleModal";

export default function Roles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", description: "Full System Access", status: "Active" },
    { id: 2, name: "Sales Manager", description: "Leads & Bookings", status: "Active" },
    { id: 3, name: "Front Desk", description: "Check-in & Basic View", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === data.id ? data : r));
    } else {
      setRoles([...roles, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Role Master</h1>
          <p className="text-gray-500 text-sm">Define user roles and access levels.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Role
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Role Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                <td className="px-6 py-4">{role.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{role.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(role)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(role.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <AddRoleModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingRole={editingRole} />}
    </AdminLayout>
  );
}