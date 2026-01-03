import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Menus() {
  const { user } = useAuth();
  const canEdit = ['F&B Manager', 'Kitchen Head', 'admin', 'Owner'].includes(user?.role);

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Paneer Tikka", category: "Starter", type: "Veg", cost: 150 },
      { id: 2, name: "Chicken Malai Kebab", category: "Starter", type: "Non-Veg", cost: 220 },
      { id: 3, name: "Dal Makhani", category: "Main Course", type: "Veg", cost: 180 },
      { id: 4, name: "Butter Chicken", category: "Main Course", type: "Non-Veg", cost: 250 },
      { id: 5, name: "Gulab Jamun", category: "Dessert", type: "Veg", cost: 80 },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ name: "", category: "Starter", type: "Veg", cost: "" });

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  const handleSave = (e) => {
    e.preventDefault();
    if (currentItem.id) {
      setMenuItems(menuItems.map(item => item.id === currentItem.id ? currentItem : item));
    } else {
      setMenuItems([...menuItems, { ...currentItem, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This could affect existing packages.")) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">F&B Menu Master</h1>
          <p className="text-gray-500 text-sm">Define all food items, categories, and costs.</p>
        </div>
        {canEdit && (
          <button onClick={() => { setCurrentItem({ name: "", category: "Starter", type: "Veg", cost: "" }); setIsModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + Add Menu Item
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Cost per Portion</th>
              {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.type}</span></td>
                <td className="px-6 py-4">₹{item.cost}</td>
                {canEdit && (
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs font-medium cursor-pointer">Delete</button>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{currentItem.id ? 'Edit Menu Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} placeholder="e.g., Starter, Dessert" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentItem.type} onChange={e => setCurrentItem({...currentItem, type: e.target.value})}>
                    <option>Veg</option>
                    <option>Non-Veg</option>
                    <option>Jain</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost per Portion (₹)</label>
                <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentItem.cost} onChange={e => setCurrentItem({...currentItem, cost: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}