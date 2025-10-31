import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) navigate("/dashboard");
    else setMessage(res.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white shadow-md rounded-lg p-6 w-96" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
        <input className="border w-full mb-3 p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border w-full mb-3 p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded" type="submit" >
          Login
        </button>
        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
