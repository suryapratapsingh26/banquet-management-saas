export default function AvailabilityCalendar() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">
        Availability Calendar
      </h2>

      <div className="flex items-center justify-between mb-3">
        <select className="input w-60">
          <option>Grand Ballroom</option>
        </select>
        <button className="btn-primary">Check Availability</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              i % 7 === 0
                ? "bg-red-500 text-white"
                : i % 5 === 0
                ? "bg-yellow-400"
                : "bg-green-500 text-white"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}