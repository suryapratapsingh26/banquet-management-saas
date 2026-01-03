import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Quotations() {
  const { user } = useAuth();
  const location = useLocation();
  const canEdit = ['Sales Manager', 'Sales Executive', 'admin', 'Banquet Manager', 'Owner'].includes(user?.role);

  // Mock Data - In real app, fetch from API
  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem("quotations");
    return saved ? JSON.parse(saved) : [
      { id: 101, leadId: 1, client: "Vikram Malhotra", version: 1, amount: 500000, status: "Draft", date: "2025-10-01" },
      { id: 102, leadId: 2, client: "Global Tech Solutions", version: 1, amount: 200000, status: "Sent", date: "2025-09-15" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [banquetHalls, setBanquetHalls] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(quotations));
  }, [quotations]);

  // Auto-open modal if navigated from Leads with a specific lead
  useEffect(() => {
    if (location.state?.lead && !isModalOpen) {
      handleCreateQuote(location.state.lead);
      // Clear state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Load menu items when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const allMenuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
      setMenuItems(allMenuItems);
      setFilteredMenu(allMenuItems);

      const allHalls = JSON.parse(localStorage.getItem("banquetHalls")) || [];
      setBanquetHalls(allHalls);
    }
  }, [isModalOpen]);

  // Recalculate total amount when items change
  useEffect(() => {
    if (currentQuote) {
      const itemsTotal = currentQuote.items?.reduce((sum, item) => sum + item.cost, 0) || 0;
      const hallTotal = currentQuote.hall?.rate ? parseInt(currentQuote.hall.rate) : 0;
      setCurrentQuote(q => ({ ...q, amount: itemsTotal + hallTotal }));
    }
  }, [currentQuote?.items, currentQuote?.hall]);

  useEffect(() => {
    setFilteredMenu(menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, menuItems]);

  const handleCreateQuote = (lead = null) => {
    setCurrentQuote({
      id: Date.now(),
      leadId: lead ? lead.id : "",
      client: lead ? lead.client : "",
      version: 1,
      amount: lead && lead.budget ? parseInt(lead.budget.replace(/[^0-9]/g, '')) * 100000 : "", // Rough parse
      status: "Draft",
      date: new Date().toISOString().split('T')[0],
      items: [],
      hall: null
    });
    setIsModalOpen(true);
  };

  const handleEditQuote = (quote) => {
    setCurrentQuote(quote);
    setIsModalOpen(true);
  };

  const handleAddItem = (item) => {
    setCurrentQuote(q => ({ ...q, items: [...(q.items || []), item] }));
  };

  const handleRemoveItem = (itemId) => {
    setCurrentQuote(q => ({ ...q, items: q.items.filter(i => i.id !== itemId) }));
  };

  const handleSelectHall = (hallId) => {
    const selectedHall = banquetHalls.find(h => h.id === parseInt(hallId));
    setCurrentQuote(q => ({ ...q, hall: selectedHall || null }));
  };

  const handleSaveQuote = (e) => {
    e.preventDefault();
    let updatedQuotes;
    if (quotations.find(q => q.id === currentQuote.id)) {
      updatedQuotes = quotations.map(q => q.id === currentQuote.id ? currentQuote : q);
    } else {
      updatedQuotes = [...quotations, currentQuote];
    }
    setQuotations(updatedQuotes);
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-700";
      case "Sent": return "bg-blue-100 text-blue-700";
      case "Negotiating": return "bg-purple-100 text-purple-700";
      case "Accepted": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quotations</h1>
          <p className="text-gray-500 text-sm">Manage proposals, versions, and negotiations.</p>
        </div>
        {canEdit && (
          <button onClick={() => handleCreateQuote()} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + New Quotation
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Quote ID</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Ver</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quote) => (
              <tr key={quote.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">QTN-{String(quote.id).slice(-4)}</td>
                <td className="px-6 py-4">{quote.client}</td>
                <td className="px-6 py-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs">v{quote.version}</span></td>
                <td className="px-6 py-4">₹{quote.amount}</td>
                <td className="px-6 py-4">{quote.date}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(quote.status)}`}>{quote.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEditQuote(quote)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">View / Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentQuote.id ? `Edit Quotation QTN-${currentQuote.id}` : "New Quotation"}
            </h2>
            <form onSubmit={handleSaveQuote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={currentQuote.client} onChange={e => setCurrentQuote({...currentQuote, client: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded" value={currentQuote.amount} onChange={e => setCurrentQuote({...currentQuote, amount: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentQuote.status} onChange={e => setCurrentQuote({...currentQuote, status: e.target.value})}>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Negotiating</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Quotation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}