// src/router/AppRouter.jsx (or separate file)
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading, isLoggingOutRef } = useAuth();
  const token = localStorage.getItem("token"); // sync check, cheap & deterministic
  const navigate = useNavigate();
  const location = useLocation();

  // when loading is done, and no token, redirect — but NOT while logging out
  useEffect(() => {
    const isLoggingOut = isLoggingOutRef?.current === true;
    if (!loading && !token && !isLoggingOut) {
      // only redirect when we are not already on a public page
      if (location.pathname !== "/") {
        navigate("/401", { replace: true });
      }
    }
  }, [loading, token, isLoggingOutRef, location.pathname, navigate]);

  // while loading show loader
  if (loading) return <div className="text-center mt-20 text-3xl">Loading...</div>;
  // if token present (fast check) render children; otherwise render nothing
  return token ? children : null;
}
