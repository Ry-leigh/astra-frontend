import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import React, { useEffect } from "react"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import About from "@/components/landing/About"
import Benefits from "@/components/landing/Benefits"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll(".fade-up")
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user}/>
      <main>
        <Hero />
        <Features />
        <About />
        <Benefits />
      </main>
      <Footer />
    </div>
  )
  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <div className="flex justify-between items-center py-4 px-8 w-full">
          <div className="flex gap-16 text-xl font-bold">
            <a href="#" className="">Home</a>
            <a href="#" className="">About</a>
          </div>
          {user ? (<Link to={"/dashboard"} className="flex rounded-full px-8 py-2 justify-center items-center bg-blue-400 text-lg font-medium text-gray-100">Dashboard</Link>) : (<Link to={"/login"} className="flex rounded-full px-8 py-2 justify-center items-center bg-blue-400 text-lg font-medium text-gray-100">Login</Link>)}
      </div>
      <div className="flex flex-col w-full h-full p-4">
        <div className="bg-blue-300 rounded-2xl h-full py-2 px-4  ">
        </div>
      </div>
    </div>
  );
}