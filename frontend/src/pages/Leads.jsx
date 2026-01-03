import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Leads() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Define who can edit/create leads
  const canEdit = ['Sales Manager', 'Sales Executive', 'CRM Executive', 'admin', 'Banquet Manager'].includes(user?.role);

  // Mock Data - In real app, fetch from API
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem("leads");
    return saved ? JSON.parse(saved) : [
      { id: 1, client: "Vikram Malhotra", type: "Wedding", date: "2025-12-10", status: "New", budget: "5 Lakhs", contact: "9876500001" },
      { id: 2, client: "Global Tech Solutions", type: "Conference", date: "2025-11-20", status: "Proposal Sent", budget: "2 Lakhs", contact: "Amit (HR)" },
      { id: 3, client: "Simran's Sangeet", type: "Social", date: "2025-10-05", status: "Negotiation", budget: "3.5 Lakhs", contact: "Mrs. Kaur" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  const updateStatus = (id, newStatus) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    setLeads(updatedLeads);
  };

  const handleCreateQuote = (lead) => {
    navigate("/quotations", { state: { lead } }); 
  };

  const handleConvertToEvent = (lead) => {
    // 1. Check for Accepted Quotation
    const allQuotes = JSON.parse(localStorage.getItem("quotations")) || [];
    const acceptedQuote = allQuotes.find(q => q.leadId === lead.id && q.status === "Accepted");

    if (!acceptedQuote) {
      alert("❌ Cannot convert to Event. No 'Accepted' quotation found for this lead.\nPlease create and finalize a quotation first.");
      return;
    }

    if (!window.confirm(`Confirm booking for ${lead.client}? This will create a new Event.`)) return;
    
    // 2. Create Event Object
    const newEvent = {
      id: Date.now(),
      name: `${lead.client} - ${lead.type}`,
      type: lead.type,
      date: lead.date,
      status: "Confirmed",
      guestCount: 0, // In real app, pull from quote
      client: lead.client,
      details: acceptedQuote // Copy the entire accepted quote for BEO generation
    };

    // 3. Save to Events (Simulating DB)
    const existingEvents = JSON.parse(localStorage.getItem("events")) || [];
    localStorage.setItem("events", JSON.stringify([...existingEvents, newEvent]));

    // 4. Update Lead Status
    updateStatus(lead.id, "Converted");
    alert("✅ Lead converted to Event! Check the Events tab.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700";
      case "Proposal Sent": return "bg-yellow-100 text-yellow-700";
      case "Negotiation": return "bg-purple-100 text-purple-700";
      case "Converted": return "bg-green-100 text-green-700";
      case "Lost": return "bg-gray-100 text-gray-500";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads & CRM</h1>
          <p className="text-gray-500 text-sm">Manage inquiries, proposals, and conversions.</p>
        </div>
        {canEdit && (
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + New Inquiry
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Tentative Date</th>
              <th className="px-6 py-3">Budget</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {lead.client}
                  <div className="text-xs text-gray-400">{lead.contact}</div>
                </td>
                <td className="px-6 py-4">{lead.type}</td>
                <td className="px-6 py-4">{lead.date}</td>
                <td className="px-6 py-4">{lead.budget}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {canEdit && lead.status !== "Converted" && lead.status !== "Lost" && (
                    <>
                      <button onClick={() => handleCreateQuote(lead)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">
                        Send Proposal
                      </button>
                      <button onClick={() => handleConvertToEvent(lead)} className="text-green-600 hover:underline text-xs font-bold cursor-pointer">
                        Convert
                      </button>
                    </>
                  )}
                  {lead.status === "Converted" && <span className="text-gray-400 text-xs">Event Created</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}