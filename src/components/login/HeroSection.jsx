import React from "react"
import Button from "./Button"
import schoolLogo from "@/assets/lv-logo.svg"
import schoolImage from "@/assets/lv.png"

export default function HeroSection() {
  return (
    <div className="relative w-full md:w-1/2 bg-violet-800 overflow-hidden flex flex-col justify-between p-8 md:p-12 min-h-[400px] md:min-h-[600px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={schoolImage}
          alt="Campus Building"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-b from-violet-600/20 via-violet-500/20 via-40% to-white/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-8">
        {/* Logo Area */}
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-2xl p-1 mb-12">
          {/* Placeholder for School Logo */}
          <div className="w-full h-full rounded-full border-4 border-violet-100 flex items-center justify-center overflow-hidden bg-white">
            <img src={schoolLogo} alt="" />
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            La Verdad Christian College
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full" />
          <blockquote className="text-lg md:text-xl text-violet-50 italic font-light leading-relaxed">
            "Wisdom based on the truth is priceless"
          </blockquote>
        </div>

        <div className="pt-8">
          <Button className="w-full md:w-auto min-w-[200px] font-semibold shadow-violet-500/20">
            Request Account
          </Button>
        </div>
      </div>
    </div>
  )
}
