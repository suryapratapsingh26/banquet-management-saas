export default function VenueCard({ name, capacity, location, price, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Capacity: {capacity}</p>
        <p>Location: {location}</p>
      </div>

      <div className="mt-4 text-pink-600 font-bold text-lg">₹{price.toLocaleString()}</div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onEdit}
          className="px-4 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-1 text-sm border border-red-400 text-red-500 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
