import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function Quotations() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [halls, setHalls] = useState([
    { id: 1, name: "Grand Ballroom (Capacity: 500)" },
    { id: 2, name: "Royal Hall (Capacity: 200)" },
    { id: 3, name: "Garden Lawn (Capacity: 1000)" }
  ]);

  // Load Data
  useEffect(() => {
    setQuotations(JSON.parse(localStorage.getItem("quotations")) || []);
    setPackages(JSON.parse(localStorage.getItem("packages")) || []);
    // Fallback mock leads if none exist in local storage
    const savedLeads = JSON.parse(localStorage.getItem("leads")) || [
      { id: 1, name: "Rahul Kapoor", phone: "9876543210" },
      { id: 2, name: "Priya Sharma", phone: "9123456789" }
    ];
    setLeads(savedLeads);
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(quotations));
  }, [quotations]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ leadId: "", packageId: "", hallId: "", eventDate: "", pax: "" });

  const handleCreate = (e) => {
    e.preventDefault();
    const selectedPkg = packages.find(p => p.id === parseInt(newQuote.packageId));
    const selectedLead = leads.find(l => l.id === parseInt(newQuote.leadId));
    const selectedHall = halls.find(h => h.id === parseInt(newQuote.hallId));

    if (!selectedPkg || !selectedLead) return;

    const totalAmount = parseFloat(selectedPkg.pricePerPax) * parseInt(newQuote.pax);

    const quote = {
      id: Date.now(),
      leadName: selectedLead.name,
      leadPhone: selectedLead.phone,
      leadId: selectedLead.id,
      packageName: selectedPkg.name,
      hallName: selectedHall ? selectedHall.name : "Not Assigned",
      hallId: newQuote.hallId,
      packageId: selectedPkg.id,
      eventDate: newQuote.eventDate,
      pax: newQuote.pax,
      pricePerPax: selectedPkg.pricePerPax,
      totalAmount: totalAmount,
      status: "Draft",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuotations([quote, ...quotations]);
    setIsModalOpen(false);
    setNewQuote({ leadId: "", packageId: "", hallId: "", eventDate: "", pax: "" });
  };

  const handleConfirm = (quote) => {
    if (!window.confirm("Are you sure you want to confirm this booking? This will create an Event.")) return;

    // 1. Conflict Check (Module 7)
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const conflict = events.find(e => e.date === quote.eventDate && e.hallId === quote.hallId && e.status !== "Cancelled");
    
    if (conflict) {
      alert(`❌ Conflict Detected!\n\nThe hall "${quote.hallName}" is already booked on ${quote.eventDate} for event: "${conflict.title}".\n\nPlease change the date or hall.`);
      return;
    }

    // 2. Update Quote Status
    const updatedQuotes = quotations.map(q => q.id === quote.id ? { ...q, status: "Confirmed" } : q);
    setQuotations(updatedQuotes);

    // 3. Create Event Entry
    const newEvent = {
      id: Date.now(),
      quoteId: quote.id,
      title: `${quote.leadName} - ${quote.packageName}`,
      date: quote.eventDate,
      pax: quote.pax,
      hallId: quote.hallId,
      packageId: quote.packageId,
      status: "Upcoming"
    };
    localStorage.setItem("events", JSON.stringify([...events, newEvent]));

    // 4. Auto-Generate Tasks from Templates (Module 4)
    const templates = JSON.parse(localStorage.getItem("taskTemplates")) || [];
    // Find package type to match template
    const pkg = packages.find(p => p.id === quote.packageId);
    const eventType = pkg ? pkg.type : "Wedding"; // Default to Wedding if not found

    const relevantTemplates = templates.filter(t => t.eventType === eventType);
    
    const newTasks = relevantTemplates.map(t => ({
      id: Date.now() + Math.random(),
      eventId: newEvent.id,
      eventTitle: newEvent.title,
      eventDate: newEvent.date,
      description: t.taskName,
      assignedRole: t.assignedRole,
      status: "Pending"
    }));

    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify([...existingTasks, ...newTasks]));

    navigate("/events");
  };

  const handlePrint = (quote) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation #${quote.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e91e63; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #e91e63; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th { background: #f8f9fa; padding: 12px; text-align: left; border: 1px solid #ddd; }
            .table td { padding: 12px; border: 1px solid #ddd; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; color: #e91e63; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Asyncotel Banquet Hall</div>
            <p>Premium Event Venue & Catering Services</p>
          </div>
          <div class="details">
            <div>
              <strong>To:</strong><br>${quote.leadName}<br>Phone: ${quote.leadPhone}
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${quote.createdAt}<br>
              <strong>Event Date:</strong> ${quote.eventDate}
              <br><strong>Venue:</strong> ${quote.hallName}
            </div>
          </div>
          <h3>Quotation for ${quote.packageName}</h3>
          <table class="table">
            <tr><th>Description</th><th style="text-align: right;">Rate</th><th style="text-align: right;">PAX</th><th style="text-align: right;">Amount</th></tr>
            <tr>
              <td>${quote.packageName} (Inclusive of Food & Service)</td>
              <td style="text-align: right;">₹${quote.pricePerPax}</td>
              <td style="text-align: right;">${quote.pax}</td>
              <td style="text-align: right;">₹${quote.totalAmount}</td>
            </tr>
          </table>
          <div class="total">Total Estimate: ₹${quote.totalAmount}</div>
          <div class="footer">This is a computer-generated quotation. Valid for 7 days.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quotations</h1>
          <p className="text-gray-500 text-sm">Generate and manage event proposals.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">+ Create New Quote</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr><th className="px-6 py-3">Client</th><th className="px-6 py-3">Package</th><th className="px-6 py-3">Venue</th><th className="px-6 py-3">Event Date</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{q.leadName}</td>
                <td className="px-6 py-4">{q.packageName}</td>
                <td className="px-6 py-4">{q.hallName}</td>
                <td className="px-6 py-4">{q.eventDate}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${q.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{q.status}</span></td>
                <td className="px-6 py-4 font-bold text-gray-800">₹{q.totalAmount}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handlePrint(q)} className="text-blue-600 hover:underline font-medium">Print</button>
                  {q.status === "Draft" && (
                    <button onClick={() => handleConfirm(q)} className="text-green-600 hover:underline font-medium">Confirm</button>
                  )}
                </td>
              </tr>
            ))}
            {quotations.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No quotations generated yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Quotation</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Select Client</label><select required className="w-full mt-1 p-2 border rounded" value={newQuote.leadId} onChange={e => setNewQuote({...newQuote, leadId: e.target.value})}><option value="">-- Select Lead --</option>{leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700">Select Package</label><select required className="w-full mt-1 p-2 border rounded" value={newQuote.packageId} onChange={e => setNewQuote({...newQuote, packageId: e.target.value})}><option value="">-- Select Package --</option>{packages.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.pricePerPax}/pax)</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700">Select Venue</label><select required className="w-full mt-1 p-2 border rounded" value={newQuote.hallId} onChange={e => setNewQuote({...newQuote, hallId: e.target.value})}><option value="">-- Select Hall --</option>{halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700">Event Date</label><input type="date" required className="w-full mt-1 p-2 border rounded" value={newQuote.eventDate} onChange={e => setNewQuote({...newQuote, eventDate: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700">Guest Count (PAX)</label><input type="number" required className="w-full mt-1 p-2 border rounded" value={newQuote.pax} onChange={e => setNewQuote({...newQuote, pax: e.target.value})} /></div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button><button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Generate</button></div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}