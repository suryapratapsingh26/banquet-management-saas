import Table from "./Table";

export default function VendorDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>

      <Table
        headers={["Event", "Service", "Status"]}
        rows={[
          ["Sharma Wedding", "Decoration", "Confirmed"],
          ["ABC Conference", "Sound", "Pending"]
        ]}
      />
    </div>
  );
}