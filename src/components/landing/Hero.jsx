import React from "react"
import { ArrowRight, PlayCircle } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-100/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[0%] w-[30%] h-[30%] bg-fuchsia-100/50 rounded-full blur-3xl opacity-60"></div>

        {/* Geometric Shapes from reference */}
        <div className="absolute top-1/3 left-0 -translate-x-1/2 w-96 h-96 border border-violet-200 rounded-full opacity-40"></div>
        <div className="absolute top-1/3 left-0 -translate-x-1/2 w-64 h-64 border border-violet-200 rounded-full opacity-40 ml-16 mt-16"></div>
        <div className="absolute top-1/3 left-0 w-32 h-px bg-violet-200"></div>
        <div className="absolute top-1/3 left-0 h-32 w-px bg-violet-200"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
            Smart attendance. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">
              Smarter classrooms.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Explore the Academic Scheduling Tracking & Reporting App — your
            partner in efficient attendance tracking and transparent classroom
            management.
          </p>

          <div className="flex items-center justify-center gap-4 mb-20">
            <button className="group bg-violet-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 flex items-center gap-2">
              Explore
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto fade-up delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60">
            {/* Browser Bar */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 inline-block w-64">
                  astra.app/dashboard
                </div>
              </div>
            </div>

            {/* App Content Placeholder Image */}
            <div className="aspect-[16/9] bg-slate-50 relative">
              <img
                src="https://picsum.photos/seed/astra_dashboard/1200/675"
                alt="Astra Dashboard Interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
