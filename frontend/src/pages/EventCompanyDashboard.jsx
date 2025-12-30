import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";

export default function EventCompanyDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Event Company Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Events" value="12" button="View Calendar" />
        <StatCard title="Monthly Revenue" value="₹18,50,000" button="View Finance" />
        <StatCard title="Open Leads" value="34" button="View CRM" />
        <StatCard title="Profit Margin" value="32%" button="View Reports" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Leads Pipeline">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <p className="font-semibold">Amit Shah Wedding</p>
                <p className="text-sm text-gray-600">Proposal Sent • 12 Aug</p>
              </div>
              <span className="text-blue-600 font-bold">₹15L</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <div>
                <p className="font-semibold">Infosys Corp Meet</p>
                <p className="text-sm text-gray-600">Confirmed • 20 Aug</p>
              </div>
              <span className="text-green-600 font-bold">₹5L</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Executions">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span>Mehta Sangeet</span> <span className="text-orange-500">Tomorrow</span></li>
            <li className="flex justify-between"><span>Tech Summit</span> <span className="text-gray-500">In 3 Days</span></li>
            <li className="flex justify-between"><span>City Marathon</span> <span className="text-gray-500">Next Week</span></li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}