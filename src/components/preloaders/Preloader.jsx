import React, { useEffect, useState } from "react"
import logo from "@/assets/logo.png"
const Preloader = ({ isLoading=true, onTransitionEnd, text="Loading" }) => {
  const [shouldRender, setShouldRender] = useState(true)

  // Handle unmount animation
  useEffect(() => {
    if (!isLoading) {
      // Small delay to allow visuals to finish before fading
      const timer = setTimeout(() => {
        setShouldRender(false)
        if (onTransitionEnd) onTransitionEnd()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isLoading, onTransitionEnd])

  if (!shouldRender) return null

  return (
    <div
      className={`flex flex-col w-full h-full items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Decorative rotating gradient ring */}
        <div className="absolute w-40 h-40 rounded-full bg-linear-to-tr from-purple-500 via-blue-400 to-purple-200 opacity-20 animate-spin-slow blur-xl"></div>

        {/* Outer Ring Spinner */}
        <div className="absolute w-32 h-32 rounded-full border-4 border-slate-100 border-t-purple-600 border-r-blue-400 animate-spin"></div>

        {/* Inner Ring Reverse Spinner (Subtle) */}
        <div
          className="absolute w-24 h-24 rounded-full border-2 border-slate-50 border-b-purple-300 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        ></div>

        {/* Logo Image */}
        <div className="relative z-10 p-4 bg-white rounded-full shadow-sm animate-pulse">
          <img
            src={logo}
            alt="A"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Status Text */}
      <p className="mt-12 text-sm font-medium text-gray-400 tracking-wide min-h-5">
        {text}...
      </p>
    </div>
  )
}

export default Preloader
