import React from "react";
import FNBDashboard from "./FNBDashboard";

export default function FnB() {
  // Render the dashboard directly to avoid nested layouts (FNBDashboard already includes AdminLayout)
  return <FNBDashboard />;
}