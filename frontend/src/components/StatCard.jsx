export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow border border-gray-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}