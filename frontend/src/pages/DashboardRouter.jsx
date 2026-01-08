import React, { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const role = (user.role || "").toString().toUpperCase();
    switch (role) {
      case "ADMIN":
      case "OWNER":
      case "COMPANY_ADMIN":
        navigate("/admin/dashboard");
        break;
      case "SUPER_ADMIN":
        navigate("/platform/dashboard");
        break;
      case "SALES":
        navigate("/sales/leads");
        break;
      case "OPS":
      case "OPS_STAFF":
      case "BANQUET_MANAGER":
        navigate("/operations/tasks");
        break;
      case "KITCHEN":
      case "FNB":
        navigate("/kitchen/dashboard");
        break;
      case "ACCOUNTS":
        navigate("/accounts/dashboard");
        break;
      default:
        navigate("/sales/leads");
    }
  }, [user, navigate]);

  return <div className="p-8 text-center">Redirecting...</div>;
}