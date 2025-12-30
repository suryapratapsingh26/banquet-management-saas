export default function StatusBadge({ status }) {
  const colors = {
    Confirmed: "bg-green-500",
    Pending: "bg-yellow-500",
    Cancelled: "bg-red-500",
    InProgress: "bg-blue-500"
  };

  return (
    <span className={`px-2 py-1 text-white text-xs rounded ${colors[status]}`}>
      {status}
    </span>
  );
}