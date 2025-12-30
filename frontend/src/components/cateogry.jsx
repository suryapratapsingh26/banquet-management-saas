const categories = [
  "Banquet Halls",
  "Wedding Lawns",
  "Conference Rooms",
  "Resorts",
  "Outdoor Venues",
];

export default function Categories() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-white shadow-md rounded-lg p-6 text-center font-medium cursor-pointer hover:bg-pink-50"
          >
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
}
