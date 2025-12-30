import Table from "./Table";

export default function FNBDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">F&B Dashboard</h1>

      <Table
        headers={["Dish", "Quantity", "Status"]}
        rows={[
          ["Veg Biryani", "200 Plates", "Prepared"],
          ["Paneer Tikka", "150 Plates", "Cooking"]
        ]}
      />

      <div className="bg-white p-4 rounded shadow">
        <p>Food Wastage: <b>8.5 kg</b></p>
        <p>Cost Variance: <b>₹2,500</b></p>
      </div>
    </div>
  );
}