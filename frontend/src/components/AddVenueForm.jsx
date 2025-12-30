import { useEffect, useState } from "react";

export default function AddVenueForm({ onSubmit, initialValues = {}, submitLabel = "Add Venue", onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setCapacity(initialValues.capacity ?? "");
      setLocation(initialValues.location || "");
      setPrice(initialValues.baseRate ?? initialValues.price ?? "");
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onSubmit === "function") {
      onSubmit({
        ...initialValues,
        name,
        description,
        capacity: Number(capacity),
        location,
        baseRate: Number(price),
      });
    }

    // clear when not editing
    if (!initialValues || !initialValues.id) {
      setName("");
      setDescription("");
      setCapacity("");
      setLocation("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">{submitLabel}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border rounded px-3 py-2"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />

        <input
          className="border rounded px-3 py-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Base Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
