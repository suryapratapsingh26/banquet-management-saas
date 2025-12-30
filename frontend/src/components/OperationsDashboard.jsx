import Table from "./Table";
import StatusBadge from "./StatusBadge";

export default function OperationsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Operations Dashboard</h1>

      <Table
        headers={["Task", "Assigned To", "Due", "Status"]}
        rows={[
          ["Stage Setup", "Decor Team", "10 AM", <StatusBadge status="InProgress" />],
          ["Sound Check", "AV Team", "11 AM", <StatusBadge status="Pending" />]
        ]}
      />
    </div>
  );
}