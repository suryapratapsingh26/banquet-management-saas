import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Vendors() {
  const { user } = useAuth();
  const canEdit = ['admin', 'Owner', 'Event Operations Manager', 'Inventory Manager'].includes(user?.role);

  // Mock Data - In real app, fetch from API
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("vendors");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Fresh Blooms Florist", category: "Decorator", contact: "9876543210", email: "blooms@example.com", status: "Active" },
      { id: 2, name: "DJ Rockerz", category: "Entertainment", contact: "9123456789", email: "dj@example.com", status: "Active" },
      { id: 3, name: "SafeGuard Security", category: "Security", contact: "8888888888", email: "security@example.com", status: "Inactive" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState({ name: "", category: "Decorator", contact: "", email: "", status: "Active" });

  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  const handleSave = (e) => {
    e.preventDefault();
    if (currentVendor.id) {
      setVendors(vendors.map(v => v.id === currentVendor.id ? currentVendor : v));
    } else {
      setVendors([...vendors, { ...currentVendor, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (vendor) => {
    setCurrentVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this vendor?")) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
          <p className="text-gray-500 text-sm">Manage external partners, decorators, and service providers.</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => { setCurrentVendor({ name: "", category: "Decorator", contact: "", email: "", status: "Active" }); setIsModalOpen(true); }} 
            className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer"
          >
            + Add Vendor
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Contact Info</th>
              <th className="px-6 py-3">Status</th>
              {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{vendor.category}</span></td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{vendor.contact}</div>
                  <div className="text-xs text-gray-400">{vendor.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {vendor.status}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(vendor)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:underline text-xs font-medium cursor-pointer">Remove</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{currentVendor.id ? 'Edit Vendor' : 'Add New Vendor'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentVendor.name} onChange={e => setCurrentVendor({...currentVendor, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="w-full mt-1 p-2 border rounded" value={currentVendor.category} onChange={e => setCurrentVendor({...currentVendor, category: e.target.value})}>
                  <option>Decorator</option>
                  <option>Entertainment</option>
                  <option>Catering</option>
                  <option>Security</option>
                  <option>Logistics</option>
                  <option>Photography</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentVendor.contact} onChange={e => setCurrentVendor({...currentVendor, contact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentVendor.status} onChange={e => setCurrentVendor({...currentVendor, status: e.target.value})}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="w-full mt-1 p-2 border rounded" value={currentVendor.email} onChange={e => setCurrentVendor({...currentVendor, email: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}