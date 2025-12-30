const events = [
  { date: "May 14, 2024", name: "Sinha Wedding", client: "Rahul Sinha", status: "Confirmed" },
  { date: "May 16, 2024", name: "Corporate Gala", client: "XYZ Corp", status: "Tentative" },
  { date: "May 18, 2024", name: "Mehta Anniversary", client: "Pooja Mehta", status: "Confirmed" },
];

export default function UpcomingEvents() {
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-gray-500">
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Client</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e, i) => (
          <tr key={i} className="border-t">
            <td>{e.date}</td>
            <td>{e.name}</td>
            <td>{e.client}</td>
            <td>
              <span
                className={`px-3 py-1 rounded text-white ${
                  e.status === "Confirmed" ? "bg-green-500" : "bg-orange-500"
                }`}
              >
                {e.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}