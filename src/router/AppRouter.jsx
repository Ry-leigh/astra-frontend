import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorRoute from "./ErrorRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-3xl">Loading...</div>; //change to a preloader once available 
  }

  return user ? children : <Navigate to="/401" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<PrivateRoute> <DashboardPage /> </PrivateRoute>}/>

      {/* Custom error routes */}
      <Route path="*" element={<ErrorRoute code={404} />} />
      <Route path="/401" element={<ErrorRoute code={401} />} />
      <Route path="/403" element={<ErrorRoute code={403} />} />
      <Route path="/500" element={<ErrorRoute code={500} />} />
    </Routes>
  );
}