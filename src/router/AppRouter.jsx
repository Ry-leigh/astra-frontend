import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-3xl">Loading...</div>; //change to a preloader once available 
  }

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