import React from "react";
import OperationsDashboard from "./OperationsDashboard";

export default function EventCoordinationDashboard() {
  // This role is very similar to Operations, so we can reuse the dashboard.
  // In a real app, this could be a more specialized version.
  return <OperationsDashboard />;
}