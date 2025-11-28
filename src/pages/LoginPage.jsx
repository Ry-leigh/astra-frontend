import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/login/Button"
import HeroSection from "@/components/login/HeroSection"
import Input from "@/components/login/Input"
import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!credentials.email) newErrors.email = "Email is required";
    if (!credentials.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const res = await login(credentials.email, credentials.password);
    setIsLoading(false);

    if (res.success) navigate("/dashboard");
    else setBackendMessage(res.message);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <main className="w-full max-w-[1200px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] z-10 relative">
        <HeroSection />
        <div className="flex w-full md:w-1/2 bg-white p-10 rounded-lg shadow-md items-center">
          <div className="w-8/10 mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="email@student.laverdad.edu.ph"
                value={credentials.email}
                onChange={handleChange}
                error={errors.email}
              />

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-base shadow-violet-500/20"
                isLoading={isLoading}
              >
                Log in
              </Button>

              {backendMessage && (
                <p className="text-center text-sm text-red-500">
                  {backendMessage}
                </p>
              )}
            </form>

            {/* <p className="pt-4 text-center text-sm text-gray-500">
              By logging in, you agree to our{" "}
              <a className="text-gray-700 underline hover:text-violet-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-gray-700 underline hover:text-violet-600">
                Privacy Policy
              </a>
              .
            </p> */}
          </div>
        </div>
      </main>
    </div>
  );
}
