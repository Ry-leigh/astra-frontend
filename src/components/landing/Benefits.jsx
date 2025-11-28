import React from "react"
import {
  Sliders,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Star,
  Zap
} from "lucide-react"

const benefits = [
  {
    title: "Instructor Empowerment & Control",
    description:
      "Instructors manage attendance with full authority and overwrite capabilities.",
    icon: Sliders
  },
  {
    title: "Efficiency & Reduced Workload",
    description:
      "Automated tracking saves time and reduces reliance on paper-based processes.",
    icon: Clock
  },
  {
    title: "Transparency & Accountability",
    description:
      "Detailed audit trails for students and faculty ensure reliable, verifiable records.",
    icon: ShieldCheck
  },
  {
    title: "Student Awareness & Engagement",
    description:
      "Real-time notifications for absences and tasks keep students informed and accountable.",
    icon: Users
  }
]

const Benefits = () => {
  return (
    <section
      id="benefits"
      className="py-24 bg-violet-100/50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Solutions</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Diagram */}
          <div className="w-full lg:w-1/2 flex justify-center relative min-h-[400px] fade-up delay-200">
            {/* Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] h-[300px] border border-violet-200 rounded-[3rem] rotate-45 transform"></div>
              <div className="absolute w-[400px] h-[400px] border border-violet-100 rounded-full"></div>
            </div>

            {/* Central Element */}
            <div className="relative z-10 w-48 h-48 bg-blue-500 rounded-3xl rotate-45 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <div className="w-32 h-32 p-4 border-4 border-white/20 rounded-xl"></div>
            </div>

            {/* Floating Icons (Simulating the diagram) */}
            <div className="absolute top-10 left-10 animate-bounce delay-700 duration-3000">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div className="absolute bottom-20 right-20 animate-bounce delay-1000 duration-3000">
              <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <Clock size={28} />
              </div>
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 animate-pulse">
              <div className="w-10 h-10 bg-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <Zap size={20} />
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                <Star size={24} />
              </div>
            </div>
          </div>

          {/* Right: List */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex flex-col gap-3 fade-up delay-${(index + 1) *
                  100}`}
              >
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-2">
                  <benefit.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
