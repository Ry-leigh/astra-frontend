import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/Auth/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // from useAuth AuthProvider useEffect(): checking localStorage for any logged users upon refresh
    return <div className="text-center mt-20">Loading...</div>;
  }

  // if user exists show page if not, redirect to login
  return user ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute> <DashboardPage /> </PrivateRoute>}/>
      </Routes>
    </Router>
  );
}