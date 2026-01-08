import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // access token kept in memory
  const [loading, setLoading] = useState(true);

  // Map role -> landing
  const goToLanding = (role) => {
    const normalizedRole = (role || '').toString().toUpperCase();
    switch (normalizedRole) {
      case "ADMIN":
      case "OWNER":
      case "COMPANY_ADMIN":
        navigate("/admin/dashboard");
        break;
      case "SALES":
      case "SALES_MANAGER":
      case "CRM_EXECUTIVE":
        navigate("/sales/leads");
        break;
      case "OPS":
      case "OPS_STAFF":
      case "BANQUET_MANAGER":
      case "EVENT_OPERATIONS_MANAGER":
        navigate("/operations/tasks");
        break;
      case "KITCHEN":
      case "FNB":
      case "KITCHEN_HEAD":
        navigate("/kitchen/dashboard");
        break;
      case "ACCOUNTS":
      case "ACCOUNTS_MANAGER":
        navigate("/accounts/dashboard");
        break;
      case "SUPER_ADMIN":
        navigate("/platform/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  // Try to rehydrate session using httpOnly refresh cookie
  useEffect(() => {
    const restore = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (!res.ok) return setLoading(false);
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
      } catch (e) {
        console.error('Session restore failed', e);
      } finally { setLoading(false); }
    };
    restore();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    goToLanding(data.user.role);
  };

  const setAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newUser) goToLanding(newUser.role);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) { console.error('Logout failed', e); }
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};