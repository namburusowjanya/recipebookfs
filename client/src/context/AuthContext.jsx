import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");

      if (!raw || raw === "undefined") return null;

      return JSON.parse(raw);
    } catch (err) {
      console.error("Invalid user in localStorage, clearing it");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}