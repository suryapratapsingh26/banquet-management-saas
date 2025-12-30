import React, { useEffect, useState } from "react";
import VenueCard from "./VenueCard";
import AddVenueForm from "./AddVenueForm";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function VenuesManager() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/venues`);
      const json = await res.json();
      setVenues(json.data || []);
    } catch (err) {
      setError("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const [editing, setEditing] = useState(null);

  const handleAdd = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/venues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const json = await res.json();
      setVenues((s) => [json.data, ...s]);
    } catch (err) {
      alert("Failed to add venue");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/venues/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const json = await res.json();
      setVenues((s) => s.map((v) => (v.id === json.data.id ? json.data : v)));
      setEditing(null);
    } catch (err) {
      alert("Failed to update venue");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this venue?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/venues/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setVenues((s) => s.filter((v) => v.id !== id));
    } catch (err) {
      alert("Failed to delete venue");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Venues</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {editing ? (
            <AddVenueForm
              initialValues={editing}
              submitLabel="Update Venue"
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <AddVenueForm onSubmit={handleAdd} />
          )}
        </div>

        <div className="lg:col-span-2">
          {loading && <p>Loading venues...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map((v) => (
              <div key={v.id}>
                <VenueCard
                  name={v.name}
                  capacity={v.capacity}
                  location={v.location}
                  price={v.baseRate}
                  onEdit={() => setEditing(v)}
                  onDelete={() => handleDelete(v.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
