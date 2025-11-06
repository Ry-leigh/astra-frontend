import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
    else {
      setMessage(res.message);
    }
  };

  return (
    <div className="flex p-4 w-screen h-screen bg-gray-100">
      <div className="flex w-full flex-col items-center justify-end pb-32">
        <a href="/request" className="h-fit w-2/3 bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold text-lg py-4 rounded">
          Request Account
        </a>
      </div>
      <div className="flex w-full">
          <form className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-12 gap-8 w-full h-full" onSubmit={handleSubmit}>
            <img className="flex w-1/4" src="./sample-logo.png" alt="" />
            <h1 className="text-4xl font-bold mb-4 text-left">Login</h1>
              <div className="flex flex-col px-20 w-full">
                <input className="text-base border w-full mb-3 p-4 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="text-base border w-full mb-3 p-4 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-4 rounded" type="submit">
                  Login
                </button>
                {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
                <Link to={"/forgot-password"}>
                  <p className="text-blue-500 underline">Forgot Password?</p>
                </Link>
              </div>
            </form>
      </div>
    </div>
  );
}
