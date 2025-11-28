import React, { useState } from "react"
import Input from "./Input"
import Button from "./Button"

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Basic validation
    const newErrors = {}
    if (!credentials.email) newErrors.email = "Email is required"
    if (!credentials.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Login logic would trigger here!")
    }, 1500)
  }

  return (
    <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="student@laverdad.edu.ph"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                error={errors.password}
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 text-base shadow-violet-500/20"
            isLoading={isLoading}
          >
            Log in
          </Button>
        </form>

        <div className="pt-4 text-center text-sm text-gray-500">
          <p>
            By logging in, you agree to our{" "}
            <a
              href="#"
              className="text-gray-700 underline hover:text-violet-600"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-gray-700 underline hover:text-violet-600"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
