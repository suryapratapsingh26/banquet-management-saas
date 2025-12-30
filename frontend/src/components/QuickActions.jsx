export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Action label="Manage Venues" />
        <Action label="Package Master" />
        <Action label="Tax Settings" />
        <Action label="User Management" />
      </div>
    </div>
  );
}

function Action({ label }) {
  return (
    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-left px-4">
      {label} →
    </button>
  );
}