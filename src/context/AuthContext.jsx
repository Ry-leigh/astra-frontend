import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete api.defaults.headers.common["Authorization"];
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  useEffect(() => {
    async function restore() {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      // set header for this attempt (optional)
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      try {
        const res = await api.get("/user");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.warn("Token validation failed — clearing auth", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "Invalid credentials" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
