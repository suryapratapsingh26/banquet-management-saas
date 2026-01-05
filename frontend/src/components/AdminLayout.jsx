import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* This Outlet is where Dashboard, Leads, etc. will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}