import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AddMenuItemModal from "../components/AddMenuItemModal";

export default function MenuItems() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Paneer Tikka", category: "Starter", type: "Veg", price: "250", status: "Active" },
    { id: 2, name: "Chicken Biryani", category: "Main Course", type: "Non-Veg", price: "350", status: "Active" },
    { id: 3, name: "Gulab Jamun", category: "Dessert", type: "Veg", price: "100", status: "Active" },
  ]);

  const handleSave = (data) => {
    if (editingItem) {
      setMenuItems(menuItems.map(i => i.id === data.id ? data : i));
    } else {
      setMenuItems([...menuItems, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter(i => i.id !== id));
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Menu Item Master</h1>
          <p className="text-gray-500 text-sm">Manage individual food items and dishes.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add Menu Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Price (₹)</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${item.type === 'Veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">₹{item.price}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {menuItems.length === 0 && <div className="p-6 text-center text-gray-400">No menu items found.</div>}
      </div>

      {isModalOpen && <AddMenuItemModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingItem={editingItem} />}
    </AdminLayout>
  );
}