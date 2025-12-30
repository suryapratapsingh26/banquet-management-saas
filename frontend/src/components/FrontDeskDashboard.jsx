import Table from "./Table";

export default function FrontDeskDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Front Desk</h1>

      <Table
        headers={["Guest", "Event", "Issue"]}
        rows={[
          ["VIP Guest", "Wedding", "Parking Assistance"],
          ["Client", "Conference", "Projector Issue"]
        ]}
      />
    </div>
  );
}