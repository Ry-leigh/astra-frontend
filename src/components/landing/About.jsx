import React from "react"
import { ArrowRight } from "lucide-react"
import schoolImage from "@/assets/lv.png"

const About = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-up">
          <h2 className="text-4xl font-bold text-slate-900">About Us</h2>
        </div>

        <div className="relative fade-up delay-200">
          {/* Main Image Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:w-3/4">
            <img
              src={schoolImage}
              alt="La Verdad Christian College Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-violet-900/50 via-black/10 via-50% to-black/10"></div>
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white">
              <h3 className="text-2xl md:text-3xl font-serif italic opacity-90">
                "Wisdom based on the truth is priceless"
              </h3>
              <p className="mt-2 font-medium opacity-80">
                La Verdad Christian College
              </p>
            </div>
          </div>

          {/* Overlapping Text Card */}
          <div className="relative mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:right-0 lg:-translate-y-1/2 lg:w-1/2 bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-100 z-20 fade-up delay-300">
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Attendance, Schedule Tracking & Reporting App 
            </h4>
            <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block mr-2 mb-0.5"></span>
                Is a digital platform that streamlines classroom management with
                a focus on attendance, absences, tardiness, and faculty logging.
              </p>
              <p>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block mr-2 mb-0.5"></span>
                Unlike student-centered systems, it prioritizes instructors by
                giving them control over attendance and activity records, while
                allowing class secretaries to assist in encoding data.
              </p>
              <p>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block mr-2 mb-0.5"></span>
                Instructors can overwrite entries when needed, ensuring accuracy
                and convenience.
              </p>
            </div>
            {/* <button className="mt-8 text-violet-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Read Full Story
              <ArrowRight size={16} />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
