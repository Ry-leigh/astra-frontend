import React from "react"
import { CalendarCheck, ListTodo, Clock, BellRing } from "lucide-react"

const features = [
  {
    title: "Attendance Management",
    description: "Record attendance and log faculty hours with ease.",
    icon: CalendarCheck,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Task Management",
    description: "Assign and keep track of tasks, ensure deadlines are met.",
    icon: ListTodo,
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    title: "Schedule Management",
    description:
      "Manage and update class schedules accessible to instructors and students.",
    icon: Clock,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Notification Management",
    description:
      "Receive important task and schedule updates and timely deadline reminders.",
    icon: BellRing,
    color: "bg-purple-100 text-purple-600"
  }
]

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-up flex flex-col items-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Features</h2>
          <button className="text-violet-600 border border-violet-200 px-6 py-2 rounded-full font-medium hover:bg-violet-50 transition-colors">
            Explore All Features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 text-center fade-up delay-${(index +
                1) *
                100}`}
            >
              <div
                className={`w-16 h-16 rounded-full ${feature.color} mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
