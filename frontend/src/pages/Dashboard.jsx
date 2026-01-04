import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import Reports from "./Reports";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Executive Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your property's performance.</p>
      </div>
      {/* Reuse the Reports component as the main dashboard widget */}
      <Reports />
    </AdminLayout>
  );
}