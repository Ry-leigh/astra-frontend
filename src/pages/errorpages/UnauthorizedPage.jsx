import React from "react"
import { Home, LogIn, KeyRound } from "lucide-react"
import { useNavigate } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"

  const variants = {
    primary:
      "bg-[#111827] text-white hover:bg-slate-800 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="opacity-90">{icon}</span>}
      {children}
    </button>
  )
}

export default function UnauthorizedPage () {
const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-50 relative overflow-hidden p-6">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-100/40 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-white/60 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* 401 Graphic */}
        <div className="flex items-center justify-center mb-8 select-none">
          <span className="text-[10rem] sm:text-[12rem] font-bold text-brand-200 leading-none">
            4
          </span>

          {/* The Zero Element - Floating Card with Key */}
          <div className="relative mx-2 sm:mx-4 animate-float">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center transform rotate-6 border border-purple-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <KeyRound
                  className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            {/* Subtle glow behind the card */}
            <div className="absolute inset-0 bg-purple-400 opacity-20 blur-xl rounded-full -z-10 transform scale-90 translate-y-4"></div>
          </div>

          <span className="text-[10rem] sm:text-[12rem] font-bold text-brand-200 leading-none">
            1
          </span>
        </div>

        {/* Headlines */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Authentication <span className="text-purple-600">required</span>.
        </h1>

        <p className="text-slate-500 text-lg mb-10 max-w-lg leading-relaxed">
          We can't verify your identity. Please sign in with your credentials to
          access this page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button variant="primary" icon={<LogIn size={18} />}>
            <button onClick={() => navigate("/login")}>
                Log In
            </button>
          </Button>
          <Button variant="secondary" icon={<Home size={18} />}>
            <button onClick={() => navigate("/")}>
                Go Home
            </button>
          </Button>
        </div>
      </div>
    </div>
  )
}
