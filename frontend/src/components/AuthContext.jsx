import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (userData) => {
    // In a real app, you'd get a token from the backend
    const mockUser = { 
      ...userData, // Spread all properties (including isSetupComplete)
      token: "mock-jwt-token"
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    if (mockUser.role === 'super_admin') {
      navigate("/super-admin-dashboard");
    } 
    // Owner & Property Admins go to Main Dashboard
    else if (['admin', 'Banquet Manager'].includes(mockUser.role)) {
      navigate("/dashboard");
    }
    // Role-Based Redirects
    else if (['Sales Manager', 'Sales Executive', 'CRM Executive'].includes(mockUser.role)) {
      navigate("/sales");
    }
    else if (['Event Operations Manager', 'Inventory Manager'].includes(mockUser.role)) {
      navigate("/operations");
    }
    else if (['Banquet Coordinator'].includes(mockUser.role)) {
      navigate("/frontdesk");
    }
    else if (['F&B Manager', 'Kitchen Head'].includes(mockUser.role)) {
      navigate("/fnb-dashboard");
    }
    else if (['Accounts Manager'].includes(mockUser.role)) {
      navigate("/accounts");
    } else {
      navigate("/dashboard"); // Fallback
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};