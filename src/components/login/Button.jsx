import React from "react"

export default function Button({
  onClick,
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 focus:ring-violet-500",
    secondary:
      "bg-white text-violet-700 hover:bg-gray-50 border border-gray-200 shadow-sm focus:ring-gray-200",
    outline:
      "bg-transparent border border-white/30 text-white hover:bg-white/10 focus:ring-white/50 backdrop-blur-sm",
    ghost:
      "bg-transparent text-violet-600 hover:bg-violet-50 hover:text-violet-700 focus:ring-violet-500"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging in...
        </>
      ) : (
        children
      )}
    </button>
  )
}
