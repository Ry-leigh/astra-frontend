import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-indigo-600">Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, {user?.first_name || "User"}!</p>
      <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={logout}>
        Logout
      </button>
    </div>
  );
}