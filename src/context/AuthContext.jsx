import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);
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
      setLoading(true);
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      try {
        const res = await api.get("/user");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.warn("Token validation failed — clearing auth", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        setUser(null)
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await api.post("/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(res.data.user);
    return { success: true };
  } catch (err) {
    // full error logging
    console.error("Login failed raw error:", err);

    let message = "An unexpected error occurred.";
    if (err.response) {
      // backend returned something
      message = err.response.data?.message || err.response.statusText;
    } else if (err.request) {
      // request made, no response
      message = "No response from server. Check connection or backend URL.";
    } else {
      // axios setup issue
      message = err.message;
    } 
    return { success: false, message };
  } finally {
      setLoading(false);
  };
};

  const logout = async () => {
    // set flag first to avoid race in PrivateRoute
    isLoggingOut.current = true;

    try {
      await api.post("/logout");
    } catch (err) {
      // ignore, still clear client-side
    } finally {
      // clear auth
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];

      // navigate after clearing
      navigate("/", { replace: true });

      // give some time for the router to settle, then release flag
      setTimeout(() => {
        isLoggingOut.current = false;
      }, 300);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggingOutRef: isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
