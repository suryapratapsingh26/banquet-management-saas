import Table from "./Table";

export default function AccountsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Accounts Dashboard</h1>

      <Table
        headers={["Invoice", "Client", "Amount", "Status"]}
        rows={[
          ["INV-101", "Kapoor Reception", "₹3,50,000", "Pending"],
          ["INV-102", "Mehta Wedding", "₹5,20,000", "Paid"]
        ]}
      />
    </div>
  );
}