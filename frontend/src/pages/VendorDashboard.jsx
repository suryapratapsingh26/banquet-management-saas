import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";

export default function VendorDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Portal</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Pending Orders" value="5" button="View Orders" />
        <StatCard title="Upcoming Deliveries" value="3" button="View Schedule" />
        <StatCard title="Outstanding Payment" value="₹45,000" button="Request Payout" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <SectionCard title="Recent Orders">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Order ID</th>
                <th>Event</th>
                <th>Item</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2">#ORD-001</td><td>Kapoor Wedding</td><td>Fresh Flowers</td><td className="text-green-600">Delivered</td></tr>
              <tr><td className="py-2">#ORD-002</td><td>Tech Conf</td><td>Audio Setup</td><td className="text-orange-500">Pending</td></tr>
              <tr><td className="py-2">#ORD-003</td><td>Birthday Bash</td><td>Balloons</td><td className="text-blue-600">Dispatched</td></tr>
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}