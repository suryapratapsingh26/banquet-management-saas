import { useAuth } from "./AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-semibold text-sm text-gray-800">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
        </div>
        <button 
          onClick={logout}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}