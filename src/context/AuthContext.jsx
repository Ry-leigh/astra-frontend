import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // tracks if still checking localStorage

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    setLoading(false); // done checking storage
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "Invalid credentials" };
    }
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
