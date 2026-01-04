import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Billing() {
  const [events, setEvents] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({ eventId: "", amount: "", mode: "Cash" });

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const savedQuotes = JSON.parse(localStorage.getItem("quotations")) || [];
    
    // Merge event with quote data for billing
    const billingData = savedEvents.map(e => {
      const q = savedQuotes.find(q => q.id === e.quoteId);
      return {
        ...e,
        totalAmount: q ? q.totalAmount : 0,
        paidAmount: e.paidAmount || 0,
        payments: e.payments || []
      };
    });
    setEvents(billingData);
  }, []);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const updatedEvents = events.map(ev => {
      if (ev.id === parseInt(currentPayment.eventId)) {
        const newPaid = (ev.paidAmount || 0) + parseFloat(currentPayment.amount);
        const newPaymentEntry = { date: new Date().toISOString().split('T')[0], amount: parseFloat(currentPayment.amount), mode: currentPayment.mode };
        return { ...ev, paidAmount: newPaid, payments: [...(ev.payments || []), newPaymentEntry] };
      }
      return ev;
    });

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setIsPaymentModalOpen(false);
    setCurrentPayment({ eventId: "", amount: "", mode: "Cash" });
    alert("Payment recorded successfully!");
  };

  const getPaymentStatus = (total, paid) => {
    if (paid >= total) return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Paid</span>;
    if (paid > 0) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Partial</span>;
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Unpaid</span>;
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Billing & Invoices</h1>
        <p className="text-gray-500 text-sm">Manage event payments and generate invoices.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Paid</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{ev.title}</td>
                <td className="px-6 py-4">{ev.date}</td>
                <td className="px-6 py-4">₹{ev.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-green-600">₹{ev.paidAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-red-600">₹{(ev.totalAmount - ev.paidAmount).toLocaleString()}</td>
                <td className="px-6 py-4">{getPaymentStatus(ev.totalAmount, ev.paidAmount)}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setCurrentPayment({ ...currentPayment, eventId: ev.id }); setIsPaymentModalOpen(true); }}
                    className="text-blue-600 hover:underline font-medium"
                    disabled={ev.paidAmount >= ev.totalAmount}
                  >
                    Record Payment
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-gray-400">No billable events found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Record Payment</h2>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentPayment.amount} onChange={e => setCurrentPayment({...currentPayment, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                <select className="w-full mt-1 p-2 border rounded" value={currentPayment.mode} onChange={e => setCurrentPayment({...currentPayment, mode: e.target.value})}>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}