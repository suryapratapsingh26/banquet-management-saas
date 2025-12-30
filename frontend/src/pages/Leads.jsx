import AdminLayout from "../layouts/AdminLayout";

export default function Leads() {
  const pipelineStages = [
    { id: 1, title: "New Enquiry", color: "border-blue-500", count: 5 },
    { id: 2, title: "Site Visit Scheduled", color: "border-yellow-500", count: 3 },
    { id: 3, title: "Proposal Sent", color: "border-purple-500", count: 4 },
    { id: 4, title: "Negotiation", color: "border-orange-500", count: 2 },
    { id: 5, title: "Confirmed / Won", color: "border-green-500", count: 8 },
  ];

  const leads = [
    { id: 101, name: "Amit Shah", event: "Wedding", date: "12 Aug", budget: "₹15L", stage: 1 },
    { id: 102, name: "Rahul Verma", event: "Birthday", date: "20 Sep", budget: "₹2L", stage: 1 },
    { id: 103, name: "Infosys HR", event: "Corporate", date: "05 Oct", budget: "₹5L", stage: 2 },
    { id: 104, name: "Priya Singh", event: "Engagement", date: "15 Nov", budget: "₹8L", stage: 3 },
    { id: 105, name: "Tech Corp", event: "Seminar", date: "10 Dec", budget: "₹3L", stage: 5 },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads & CRM</h1>
          <p className="text-gray-500 text-sm">Manage your enquiry pipeline and conversions.</p>
        </div>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Add New Lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="min-w-[280px] bg-gray-50 rounded-xl p-4 flex flex-col h-full">
            <div className={`flex justify-between items-center mb-4 border-b-2 ${stage.color} pb-2`}>
              <h3 className="font-semibold text-gray-700">{stage.title}</h3>
              <span className="bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {stage.count}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {leads
                .filter((lead) => lead.stage === stage.id)
                .map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{lead.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {lead.event}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>📅 {lead.date}</p>
                      <p>💰 {lead.budget}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100">
                        Call
                      </button>
                      <button className="flex-1 text-xs bg-green-50 text-green-600 py-1 rounded hover:bg-green-100">
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Empty State Placeholder */}
                {leads.filter((l) => l.stage === stage.id).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4 italic">No leads here</div>
                )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}