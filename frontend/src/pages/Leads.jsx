import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Leads() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Define who can edit/create leads
  const canEdit = ['Sales Manager', 'Sales Executive', 'CRM Executive', 'admin', 'Banquet Manager'].includes(user?.role);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:5000/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    // Optimistic UI Update
    const originalLeads = [...leads];
    const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    setLeads(updatedLeads);

    try {
      const token = await user.getIdToken();
      await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error("Failed to update status", error);
      setLeads(originalLeads); // Revert on error
    }
  };

  const handleCreateQuote = (lead) => {
    navigate("/quotations", { state: { lead } }); 
  };

  const handleConvertToEvent = async (lead) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      
      // 1. Fetch quotes to find one for this lead
      const res = await fetch('http://localhost:5000/api/quotations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allQuotes = await res.json();
      
      // Find a relevant quote (Draft or Accepted)
      const leadQuote = allQuotes.find(q => q.leadId === lead.id);

      if (!leadQuote) {
        alert("❌ No quotation found for this lead. Please create a proposal first.");
        navigate("/quotations", { state: { lead } });
        return;
      }

      if (window.confirm(`Found quotation for "${leadQuote.packageName}". Confirm booking and create Event?`)) {
         const confirmRes = await fetch(`http://localhost:5000/api/quotations/${leadQuote.id}/confirm`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
         });
         if (confirmRes.ok) {
            alert("✅ Lead converted to Event!");
            updateStatus(lead.id, "Converted");
            navigate("/events");
         } else {
            alert("Failed to convert lead. Please check if the quotation is valid.");
         }
      }
    } catch (error) {
      console.error("Error converting lead:", error);
    }
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
    <>
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

      {loading ? <div className="text-center p-10">Loading Leads from Database...</div> : (
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
      )}
    </>
  );
}