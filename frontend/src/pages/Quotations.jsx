import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Quotations() {
  const { user } = useAuth();
  const { token } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ eventId: "", venueCost: 0, foodCost: 0, decorCost: 0, taxAmount: 0, discount: 0 });
  const [events, setEvents] = useState([]); // Events without quotes

  useEffect(() => {
    if (!token) return;
    fetchQuotes();
    // Fetch events logic would go here to populate dropdown
  }, [user, token]);

  const fetchQuotes = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/quotations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setQuotes(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newQuote)
      });
      fetchQuotes();
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handlePrint = (q) => {
    const printWindow = window.open('', '', 'width=800,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation #${q.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #e91e63; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Asyncotel Banquets</div>
            <p>Official Quotation</p>
          </div>
          <p><strong>Event:</strong> ${q.event?.title || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <table class="table">
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Venue Rental</td><td>₹${q.venueCost}</td></tr>
            <tr><td>Food & Beverage</td><td>₹${q.foodCost}</td></tr>
            <tr><td>Decoration</td><td>₹${q.decorCost || 0}</td></tr>
            <tr><td>Taxes</td><td>₹${q.taxAmount}</td></tr>
            <tr><td>Discount</td><td>- ₹${q.discount || 0}</td></tr>
          </table>

          <div class="total">
            Grand Total: ₹${q.totalAmount}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quotations</h1>
          <p className="text-gray-500 text-sm">Generate and manage price quotes.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          + Create Quote
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Venue Cost</th>
              <th className="px-6 py-3">Food Cost</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{q.event?.title || "Unknown Event"}</td>
                <td className="px-6 py-4">₹{q.venueCost}</td>
                <td className="px-6 py-4">₹{q.foodCost}</td>
                <td className="px-6 py-4 font-bold text-green-600">₹{q.totalAmount}</td>
                <td className="px-6 py-4">{new Date(q.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handlePrint(q)} className="text-blue-600 hover:underline text-xs font-bold">Print PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Quotation</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event ID (Manual for now)</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newQuote.eventId} onChange={e => setNewQuote({...newQuote, eventId: e.target.value})} placeholder="Paste Event ID" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Cost</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded" value={newQuote.venueCost} onChange={e => setNewQuote({...newQuote, venueCost: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Food Cost</label>
                  <input type="number" className="w-full mt-1 p-2 border rounded" value={newQuote.foodCost} onChange={e => setNewQuote({...newQuote, foodCost: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}