import React, { useState } from 'react';
import VenuesManager from '../components/VenuesManager';
import StatCard from '../components/StatCard';
import CalendarCard from '../components/CalendarCard';
import RevenueChart from '../components/RevenueChart';
import TaskManager from '../components/TaskManager';
import StaffOverview from '../components/StaffOverview';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Mock data for demonstration
  const [stats] = useState([
    { title: "Active Events", value: "12", change: "+2", isPositive: true },
    { title: "Monthly Revenue", value: "₹ 18.5L", change: "+12%", isPositive: true },
    { title: "Leads Pipeline", value: "34", change: "+5", isPositive: true },
    { title: "Profit Margin", value: "32%", change: "+1.5%", isPositive: true },
  ]);

  const [upcomingEvents] = useState([
    { id: 1, title: "Amit Wedding", client: "Amit Shah", date: "12 Aug", status: "Confirmed", venue: "Taj Hall" },
    { id: 2, title: "Infosys Meet", client: "Infosys HR", date: "20 Aug", status: "Execution", venue: "Emerald Hall" },
    { id: 3, title: "Rahul Birthday", client: "Rahul V", date: "25 Aug", status: "Proposal", venue: "Home Lawn" },
    { id: 4, title: "Tech Expo", client: "StartUp Inc", date: "01 Sep", status: "Inquiry", venue: "City Center" },
  ]);

  // Mock Data for Leads Module
  const [leads] = useState([
    { id: 1, name: "Amit Shah", type: "Wedding", date: "12 Aug", stage: "Proposal", value: "₹ 15L" },
    { id: 2, name: "Infosys HR", type: "Corporate", date: "20 Aug", stage: "Confirmed", value: "₹ 4L" },
    { id: 3, name: "Rahul V", type: "Birthday", date: "25 Aug", stage: "Negotiation", value: "₹ 1.5L" },
    { id: 4, name: "Priya M", type: "Wedding", date: "10 Dec", stage: "Inquiry", value: "₹ 22L" },
  ]);

  // Mock Data for Vendors Module
  const [vendors] = useState([
    { id: 1, name: "Royal Decor", type: "Decor", rating: 4, status: "Active" },
    { id: 2, name: "SoundPro", type: "AV", rating: 5, status: "Active" },
    { id: 3, name: "Fresh Bites", type: "Catering", rating: 4.5, status: "Busy" },
  ]);

  // Mock Data for Events Module
  const [eventsList] = useState([
    { id: 1, name: "Amit Wedding", client: "Amit Shah", date: "12 Aug", status: "Confirmed" },
    { id: 2, name: "Infosys Meet", client: "Infosys HR", date: "20 Aug", status: "Execution" },
  ]);

  // Mock Data for Banquet Halls Module
  const [halls] = useState([
    { id: 1, name: "Emerald Hall", city: "Indore", capacity: 300, commission: "10%" },
  ]);

  // Mock Data for Services Module
  const [services] = useState([
    { id: 1, name: "Wedding Decor", type: "Decor", price: "₹ 1,50,000" },
    { id: 2, name: "Corporate AV", type: "AV", price: "₹ 40,000" },
  ]);

  // Mock Data for Billing Module
  const [billing] = useState({ invoiced: "₹ 25,00,000", received: "₹ 18,00,000", outstanding: "₹ 7,00,000" });
  const [invoices] = useState([
    { id: "INV-1023", event: "Amit Wedding", status: "Partial" },
  ]);

  const handleAction = (action) => {
    alert(`Action triggered: ${action}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEvent(null); // Reset selected event when switching main modules
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-pink-500">Asyncotel</h1>
          <p className="text-xs text-slate-400 mt-1">Event Management Co.</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {['Dashboard', 'Leads & CRM', 'Events', 'Banquet Halls', 'Vendors', 'Services & Pricing', 'Team & Roles', 'Billing & Accounts', 'Reports', 'Settings'].map((item) => (
            <NavItem 
              key={item} 
              active={activeTab === item} 
              onClick={() => handleTabChange(item)}
            >
              {item}
            </NavItem>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center font-bold">BM</div>
            <div>
              <p className="text-sm font-medium">Company Admin</p>
              <p className="text-xs text-slate-400">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedEvent ? selectedEvent.name : `${activeTab} Overview`}</h2>
            <p className="text-gray-500">Welcome back, here's your event summary.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => handleAction('Notifications')}
               className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
             >
               Notifications
             </button>
             <button 
               onClick={() => handleAction('New Booking')}
               className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 shadow-sm"
             >
               + New Booking
             </button>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatCard title={stats[0].title} value={stats[0].value} hint={stats[0].change} color="indigo" />
              <StatCard title={stats[1].title} value={stats[1].value} hint={stats[1].change} color="green" />
              <StatCard title={stats[2].title} value={stats[2].value} hint={stats[2].change} color="orange" />
              <StatCard title={stats[3].title} value={stats[3].value} hint={stats[3].change} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <CalendarCard />
                <div className="mt-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <h4 className="font-semibold">Upcoming Events</h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      {upcomingEvents.slice(0,3).map(e => (
                        <li key={e.id} className="flex justify-between">
                          <div>{e.date} · {e.title}</div>
                          <div className="text-gray-500">{e.venue}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <RevenueChart />
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                      <p className="text-sm text-gray-500">Today's Events</p>
                      <p className="text-xl font-bold">5</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                      <p className="text-sm text-gray-500">Total Guests</p>
                      <p className="text-xl font-bold">450</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                      <p className="text-sm text-gray-500">Pending Tasks</p>
                      <p className="text-xl font-bold">7</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-3 space-y-4">
                <div>
                  <TaskManager />
                </div>
                <div>
                  <StaffOverview />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <h4 className="font-semibold mb-2">Operations Status</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between"><span>Setup</span><span className="text-green-600">In Progress</span></div>
                    <div className="flex justify-between"><span>Catering</span><span className="text-yellow-600">Ready</span></div>
                    <div className="flex justify-between"><span>Inventory</span><span className="text-green-600">All Set</span></div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* MODULE 1: LEADS & CRM DASHBOARD */}
        {activeTab === 'Leads & CRM' && (
          <div className="space-y-6">
            {/* Pipeline Summary */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {['Inquiry', 'Proposal', 'Negotiation', 'Confirmed', 'Lost'].map(stage => (
                <div key={stage} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">{stage}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{leads.filter(l => l.stage === stage).length}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Leads Pipeline</h3>
                <button className="bg-pink-600 text-white px-4 py-2 rounded text-sm hover:bg-pink-700">+ Add Lead</button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Lead Name</th>
                    <th className="px-6 py-3 font-medium">Event Type</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Est. Value</th>
                    <th className="px-6 py-3 font-medium">Stage</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.type}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.date}</td>
                      <td className="px-6 py-4 text-gray-600">{lead.value}</td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{lead.stage}</span></td>
                      <td className="px-6 py-4 text-pink-600 hover:underline cursor-pointer">View</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 4: VENDOR MANAGEMENT DASHBOARD */}
        {activeTab === 'Vendors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{vendor.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">{vendor.type}</span>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">{'⭐'.repeat(Math.floor(vendor.rating))}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {vendor.status}
                  </span>
                  <button className="text-sm text-pink-600 font-medium hover:underline">View Profile</button>
                </div>
              </div>
            ))}
            <button className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors">
              <span className="text-2xl mb-2">+</span>
              <span className="font-medium">Add New Vendor</span>
            </button>
          </div>
        )}

        {/* MODULE 2: EVENT DASHBOARD */}
        {activeTab === 'Events' && !selectedEvent && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Event List</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Event Name</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventsList.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 text-gray-600">{event.client}</td>
                    <td className="px-6 py-4 text-gray-600">{event.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={event.status} /></td>
                    <td className="px-6 py-4 text-pink-600 hover:underline cursor-pointer" onClick={() => setSelectedEvent(event)}>Manage</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 2: EVENT DETAIL VIEW (Tabbed UI) */}
        {activeTab === 'Events' && selectedEvent && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Back Button */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-900">← Back to List</button>
            </div>
            
            {/* Detail Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {['Overview', 'Banquet', 'Services', 'Vendors', 'Finance', 'Checklist'].map(tab => (
                <button 
                  key={tab}
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-600 focus:outline-none"
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Mock Content for Detail Tabs (Showing Overview & Checklist as example) */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Overview Section */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Event Overview</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Client Name</span>
                      <span className="font-medium">{selectedEvent.client}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Event Date</span>
                      <span className="font-medium">{selectedEvent.date}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Status</span>
                      <StatusBadge status={selectedEvent.status} />
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Guest Count</span>
                      <span className="font-medium">450 Pax</span>
                    </div>
                  </div>
                </div>

                {/* Checklist Section */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Task Checklist</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                      <input type="checkbox" checked readOnly className="text-pink-600 rounded" />
                      <span className="text-sm text-gray-700 line-through">Stage Setup Design</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                      <input type="checkbox" checked readOnly className="text-pink-600 rounded" />
                      <span className="text-sm text-gray-700 line-through">Food Tasting</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="text-pink-600 rounded" />
                      <span className="text-sm text-gray-900">Final Payment Collection</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: BANQUET HALL MANAGEMENT */}
        {activeTab === 'Banquet Halls' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between">
              <h3 className="font-semibold text-lg">Linked Banquet Halls</h3>
              <button className="text-sm text-pink-600 font-medium">+ Link New Hall</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Hall Name</th>
                  <th className="px-6 py-3 font-medium">City</th>
                  <th className="px-6 py-3 font-medium">Capacity</th>
                  <th className="px-6 py-3 font-medium">Commission</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {halls.map((hall) => (
                  <tr key={hall.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{hall.name}</td>
                    <td className="px-6 py-4 text-gray-600">{hall.city}</td>
                    <td className="px-6 py-4 text-gray-600">{hall.capacity} Pax</td>
                    <td className="px-6 py-4 text-gray-600">{hall.commission}</td>
                    <td className="px-6 py-4 text-pink-600 hover:underline cursor-pointer">Check Availability</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 5: SERVICES & PRICING */}
        {activeTab === 'Services & Pricing' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Service Catalog</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Service Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Base Price</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-gray-600">{service.type}</td>
                    <td className="px-6 py-4 text-gray-600">{service.price}</td>
                    <td className="px-6 py-4 text-pink-600 hover:underline cursor-pointer">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODULE 6: BILLING & ACCOUNTS */}
        {activeTab === 'Billing & Accounts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Invoiced</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{billing.invoiced}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Received</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{billing.received}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Outstanding</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{billing.outstanding}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-lg">Recent Invoices</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Invoice No</th>
                    <th className="px-6 py-3 font-medium">Event Name</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                      <td className="px-6 py-4 text-gray-600">{inv.event}</td>
                      <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">{inv.status}</span></td>
                      <td className="px-6 py-4 text-pink-600 hover:underline cursor-pointer">Download</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 7 & 8: REPORTS & SETTINGS (Simplified) */}
        {(activeTab === 'Reports' || activeTab === 'Settings' || activeTab === 'Team & Roles') && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h3 className="text-xl font-bold mb-4">{activeTab}</h3>
             <div className="space-y-4">
               {activeTab === 'Reports' && (
                 <ul className="list-disc list-inside space-y-2 text-gray-700">
                   <li>Event Profitability Report</li>
                   <li>Sales Conversion Report</li>
                   <li>Vendor Cost Analysis</li>
                   <li>Monthly Revenue Trend</li>
                 </ul>
               )}
               {activeTab === 'Settings' && <p className="text-gray-600">Company Profile, Roles & Permissions, Taxes & GST settings are managed here.</p>}
               {activeTab === 'Team & Roles' && <p className="text-gray-600">Manage your team members, assign roles (Sales, Operations), and permissions.</p>}
             </div>
           </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ children, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function ActionCard({ title, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-md transition-all group"
    >
      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{title}</span>
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-green-100 text-green-700",
    Execution: "bg-blue-100 text-blue-700",
    Proposal: "bg-yellow-100 text-yellow-700",
    Inquiry: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
