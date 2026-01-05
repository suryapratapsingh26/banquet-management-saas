import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (error) { console.error(error); }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Sales Manager", phone: "", password: "" });

  // ALIGNED WITH AUTHORITY MAP (LEVEL 3 & 4)
  const roles = [
    "Sales Manager", 
    "Sales Executive", 
    "CRM Executive",
    "Event Operations Manager", 
    "Banquet Coordinator", 
    "F&B Manager", 
    "Kitchen Head", 
    "Inventory Manager", 
    "Accounts Manager", 
    "HR Manager"
  ];

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUser)
      });
      fetchUsers();
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", role: "Sales Manager", phone: "", password: "" });
      alert("User created!");
    } catch (error) { console.error(error); }
  };

  const handleRemoveUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        const token = await user.getIdToken();
        await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) { console.error(error); }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-sm">Manage staff access and roles (Internal Only).</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          + Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{user.role}</span></td>
                <td className="px-6 py-4"><span className="text-green-600 text-xs font-bold">{user.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleRemoveUser(user.id)} className="text-red-600 hover:underline text-xs font-medium cursor-pointer">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Staff</h2>
            <p className="text-xs text-gray-500 mb-4">Creates a user account. They will use these credentials to login.</p>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="w-full mt-1 p-2 border rounded" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Set password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="w-full mt-1 p-2 border rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}