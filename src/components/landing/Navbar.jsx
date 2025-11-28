import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "@/assets/logo.png"

function Navbar({ user }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About Us", href: "#about" },
    { name: "Solutions", href: "#benefits" }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex w-1/28 items-center gap-4">
          <img src={logo} className="w-fit" alt="A" />
          <span className="text-lg font-semibold">ASTRA</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
            {user ? (<Link to={"/dashboard"} className="bg-violet-600 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">Dashboard</Link>) : (<Link to={"/login"} className="bg-violet-600 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">Login</Link>)}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-slate-600 py-2 border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            {user ? (<Link to={"/dashboard"} className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold">Dashboard</Link>) : (<Link to={"/login"} className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold">Login</Link>)}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
