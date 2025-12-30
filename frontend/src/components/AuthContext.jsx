import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (userData) => {
    // In a real app, you'd get a token from the backend
    const mockUser = { 
      name: userData.name, 
      role: userData.role, 
      token: "mock-jwt-token" 
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    if (mockUser.role === 'super_admin') {
      navigate("/super-admin-dashboard");
    } else {
      navigate("/dashboard");
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