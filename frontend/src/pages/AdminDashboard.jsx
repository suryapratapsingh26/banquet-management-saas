import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import QuickActions from "../components/QuickActions";
import TasksAlerts from "../components/TasksAlerts";
import UpcomingEvents from "../components/UpcomingEvents";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, Aakash!</h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Events" value="4" button="View Schedule" />
        <StatCard title="Monthly Revenue" value="₹12,50,000" button="View Reports" />
        <StatCard title="Pending Payments" value="₹3,80,000" button="View Details" />
        <StatCard title="New Enquiries" value="8" button="View Enquiries" />
      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard title="Booking Overview" className="lg:col-span-2">
          <div className="h-48 bg-gradient-to-t from-green-300 via-yellow-200 to-red-300 rounded" />
          <p className="text-sm mt-3 text-gray-600">
            <span className="text-green-600 font-semibold">24</span> Confirmed ·
            <span className="text-orange-500 font-semibold"> 12</span> Tentative ·
            <span className="text-red-500 font-semibold"> 5</span> Cancelled
          </p>
        </SectionCard>

        <SectionCard title="Tasks & Alerts">
          <TasksAlerts />
        </SectionCard>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <SectionCard title="Upcoming Events" className="lg:col-span-2">
          <UpcomingEvents />
        </SectionCard>
      </div>
    </div>
  );
}