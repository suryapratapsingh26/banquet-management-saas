import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Billing() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({ eventId: "", amount: "", mode: "Cash" });

  useEffect(() => {
    fetchBillingData();
  }, [user]);

  const fetchBillingData = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:5000/api/billing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEvents(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          eventId: currentPayment.eventId,
          amount: parseFloat(currentPayment.amount),
          mode: currentPayment.mode
        })
      });
      fetchBillingData();
      setIsPaymentModalOpen(false);
      setCurrentPayment({ eventId: "", amount: "", mode: "Cash" });
      alert("Payment recorded successfully!");
    } catch (error) { console.error(error); }
  };

  const getPaymentStatus = (total, paid) => {
    if (paid >= total) return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Paid</span>;
    if (paid > 0) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Partial</span>;
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Unpaid</span>;
  };

  const handlePrintInvoice = (ev) => {
    const printWindow = window.open('', '', 'width=800,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${ev.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e91e63; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #e91e63; }
            .invoice-title { font-size: 32px; font-weight: bold; color: #333; text-align: right; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .table td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { text-align: right; margin-top: 20px; }
            .totals div { margin-bottom: 5px; }
            .grand-total { font-size: 20px; font-weight: bold; color: #e91e63; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Asyncotel Banquets</div>
              <p>123 Event Street, City Center<br>Phone: +91 88893 65318</p>
            </div>
            <div class="invoice-title">INVOICE</div>
          </div>

          <div class="details-grid">
            <div>
              <strong>Bill To:</strong><br>
              ${ev.title.split('-')[0]}<br>
              Event Date: ${ev.date}
            </div>
            <div style="text-align: right;">
              <strong>Invoice #:</strong> INV-${ev.id}<br>
              <strong>Date:</strong> ${new Date().toISOString().split('T')[0]}
            </div>
          </div>

          <table class="table">
            <tr><th>Description</th><th style="text-align: right;">Amount</th></tr>
            <tr><td>Banquet Services (Package: ${ev.title.split('-')[1]})</td><td style="text-align: right;">₹${ev.totalAmount.toLocaleString()}</td></tr>
            ${ev.damageCost > 0 ? `<tr><td style="color: red;">Damage Charges: ${ev.damageDescription}</td><td style="text-align: right; color: red;">₹${ev.damageCost.toLocaleString()}</td></tr>` : ''}
          </table>

          <div class="totals">
            <div>Total Amount: ₹${ev.totalAmount.toLocaleString()}</div>
            <div>Less: Paid Amount: ₹${ev.paidAmount.toLocaleString()}</div>
            <div class="grand-total">Balance Due: ₹${(ev.totalAmount - ev.paidAmount).toLocaleString()}</div>
          </div>

          <div class="footer">Thank you for your business! Please pay the balance before the event date.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
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
                  <button onClick={() => handlePrintInvoice(ev)} className="text-gray-600 hover:underline font-medium ml-3">
                    Invoice
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
    </>
  );
}