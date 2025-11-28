import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Input({ label, type = "text", className, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  const togglePassword = () => setShowPassword(!showPassword)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      <div className="relative group">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full px-4 py-3 rounded-xl border bg-gray-50
            text-gray-900 placeholder-gray-400
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white
            ${
              error
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200"
            }
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  )
}
