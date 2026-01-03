import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Billing() {
  const { user } = useAuth();
  const canEdit = ['Accounts Manager', 'admin', 'Owner'].includes(user?.role);

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [
      { id: 'INV-001', eventId: 2, eventName: "TechCorp Annual Meet", amount: 250000, status: "Paid", dueDate: "2025-11-10" },
      { id: 'INV-002', eventId: 1, eventName: "Rahul & Priya Wedding", amount: 800000, status: "Partially Paid", dueDate: "2025-11-25" },
      { id: 'INV-003', eventId: 3, eventName: "Shanaya's 5th Birthday", amount: 120000, status: "Pending", dueDate: "2025-10-15" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ eventId: "", amount: "", dueDate: "" });

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  // Fetch events to populate dropdown
  useEffect(() => {
    const allEvents = JSON.parse(localStorage.getItem("events")) || [];
    // Only allow billing for Confirmed or Completed events
    setEvents(allEvents.filter(e => e.status === 'Confirmed' || e.status === 'Completed'));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-700";
      case "Partially Paid": return "bg-yellow-100 text-yellow-700";
      case "Pending": return "bg-red-100 text-red-700";
      case "Overdue": return "bg-red-200 text-red-800 font-bold";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    if (!canEdit) return;
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const selectedEvent = events.find(event => event.id === parseInt(newInvoice.eventId));
    if (!selectedEvent) {
      alert("Please select a valid event.");
      return;
    }

    const invoiceToAdd = {
      id: `INV-${String(Date.now()).slice(-4)}`,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      amount: parseFloat(newInvoice.amount),
      status: "Pending",
      dueDate: newInvoice.dueDate
    };

    setInvoices([...invoices, invoiceToAdd]);
    setIsModalOpen(false);
    setNewInvoice({ eventId: "", amount: "", dueDate: "" });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm">Manage event payments, invoices, and financial status.</p>
        </div>
        {canEdit && (
          <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + Create Invoice
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Event Name</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
              {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 text-pink-600">{invoice.eventName}</td>
                <td className="px-6 py-4">₹{invoice.amount.toLocaleString()}</td>
                <td className="px-6 py-4">{invoice.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={invoice.status} 
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className="text-xs border rounded p-1 bg-white"
                    >
                      <option>Pending</option>
                      <option>Partially Paid</option>
                      <option>Paid</option>
                      <option>Overdue</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Invoice</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Event</label>
                <select 
                  required 
                  className="w-full mt-1 p-2 border rounded" 
                  value={newInvoice.eventId} 
                  onChange={e => setNewInvoice({...newInvoice, eventId: e.target.value})}
                >
                  <option value="">-- Choose an event --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Amount (₹)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full mt-1 p-2 border rounded" 
                  value={newInvoice.amount} 
                  onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full mt-1 p-2 border rounded" 
                  value={newInvoice.dueDate} 
                  onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}