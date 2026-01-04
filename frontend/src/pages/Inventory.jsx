import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Inventory() {
  const { user } = useAuth();
  const canEdit = ['Inventory Manager', 'Kitchen Head', 'admin', 'Owner'].includes(user?.role);
  const [activeTab, setActiveTab] = useState("stock");

  // 1. Dynamic Stock State
  const [stockItems, setStockItems] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [
      { id: 1, item: "Basmati Rice", category: "Grains", quantity: 50, unit: "kg", reorderLevel: 10, status: "Good", unitPrice: 90 },
      { id: 2, item: "Cooking Oil", category: "Essentials", quantity: 12, unit: "L", reorderLevel: 20, status: "Low", unitPrice: 140 },
      { id: 3, item: "Paneer", category: "Dairy", quantity: 5, unit: "kg", reorderLevel: 5, status: "Critical", unitPrice: 420 },
    ];
  });

  // 2. Fetch Real Vendors from LocalStorage (Integration)
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const savedVendors = JSON.parse(localStorage.getItem("vendors")) || [];
    setVendors(savedVendors);
  }, []);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(stockItems));
  }, [stockItems]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ item: "", category: "Grains", quantity: "", unit: "kg", reorderLevel: "", unitPrice: "" });

  const handleSaveItem = (e) => {
    e.preventDefault();
    const qty = parseFloat(currentItem.quantity);
    const reorder = parseFloat(currentItem.reorderLevel);
    const price = parseFloat(currentItem.unitPrice) || 0;
    
    // Auto-calculate status
    let status = "Good";
    if (qty <= reorder) status = "Critical";
    else if (qty <= reorder * 1.2) status = "Low";

    const newItem = { ...currentItem, quantity: qty, reorderLevel: reorder, unitPrice: price, status };

    if (currentItem.id) {
      setStockItems(stockItems.map(i => i.id === currentItem.id ? { ...newItem, id: currentItem.id } : i));
    } else {
      setStockItems([...stockItems, { ...newItem, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory & Store</h1>
          <p className="text-gray-500 text-sm">Manage stock levels, procurement, and vendors.</p>
        </div>
        {canEdit && activeTab === "stock" && (
          <div className="flex gap-2">
            <button onClick={() => { setCurrentItem({ item: "", category: "Grains", quantity: "", unit: "kg", reorderLevel: "", unitPrice: "" }); setIsModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
              + Add Stock Item
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "stock" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("stock")}
        >
          Stock Ledger
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "vendors" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("vendors")}
        >
          Vendors
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">{activeTab === "stock" ? "Item Name" : "Vendor"}</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">{activeTab === "stock" ? "Current Stock" : "Contact Info"}</th>
              {activeTab === "stock" && <th className="px-6 py-3">Unit Price</th>}
              {activeTab === "stock" && <th className="px-6 py-3">Status</th>}
              {activeTab === "stock" && canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(activeTab === "stock" ? stockItems : vendors).map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{activeTab === "stock" ? item.item : item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{activeTab === "stock" ? `${item.quantity} ${item.unit}` : item.contact}</td>
                {activeTab === "stock" && <td className="px-6 py-4">₹{item.unitPrice}</td>}
                {activeTab === "stock" && (
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === "Good" ? "bg-green-100 text-green-800" : item.status === "Low" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                      {item.status}
                    </span>
                  </td>
                )}
                {activeTab === "stock" && canEdit && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setCurrentItem(item); setIsModalOpen(true); }} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">Update</button>
                  </td>
                )}
              </tr>
            ))}
            {activeTab === "vendors" && vendors.length === 0 && (
              <tr><td colSpan="4" className="p-6 text-center text-gray-400">No vendors found. Add them in the Vendors module.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{currentItem.id ? 'Update Stock' : 'Add New Item'}</h2>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentItem.item} onChange={e => setCurrentItem({...currentItem, item: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentItem.unit} onChange={e => setCurrentItem({...currentItem, unit: e.target.value})}>
                    <option>kg</option>
                    <option>L</option>
                    <option>pcs</option>
                    <option>packs</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentItem.quantity} onChange={e => setCurrentItem({...currentItem, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
                  <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentItem.reorderLevel} onChange={e => setCurrentItem({...currentItem, reorderLevel: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Unit Price (₹)</label>
                  <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentItem.unitPrice} onChange={e => setCurrentItem({...currentItem, unitPrice: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}