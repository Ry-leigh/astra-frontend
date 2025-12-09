import PageHeader from "@/components/elements/PageHeader";
import api from "../api/axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react"
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from "recharts"
import { UserRoundCheck, UserRoundMinus, UserRoundX, CircleUserRound, GraduationCap, Presentation, MapPin, CalendarDays, Clock4, Clock, SquareCheckBig } from "lucide-react"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { useAuth } from "@/context/AuthContext";
import Preloader from "@/components/preloaders/Preloader";

dayjs.extend(advancedFormat)

const monthNames = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="mb-2 text-gray-500 font-medium">
          {monthNames[label] || label}
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 font-medium w-20 capitalize">
                {entry.name}:
              </span>
              <span className="font-bold text-gray-800">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const AttendanceChart = ({ attendance, role }) => {
  const [visible, setVisible] = useState({
    present: true,
    late: true,
    absent: true
  })

  const toggleSeries = key => {
    setVisible(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-white rounded-xl p-6 w-full min-h-112 h-full ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
          <p className="text-gray-500 text-sm mt-1">
            {role == 'Administrator' ? "Users monthly attendance report"
              : role == 'Instructor' ? "Your students monthly attendance report"
                : role == 'Student' || role == 'Officer' ? 'Your monthly attendance report' : null}
          </p>
        </div>
        {/* <div className="flex items-center gap-2 mt-4 md:mt-0">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <span className="text-2xl font-bold text-gray-900">27, 695.65</span>
        </div> */}
      </div>

      {/* Stats Row (Interactive Legend) */}
      <div className="flex flex-wrap gap-6 mb-8 select-none">
        {/* present Stat */}
        <div
          onClick={() => toggleSeries("present")}
          className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${visible.present ? "opacity-100" : "opacity-40 grayscale"
            }`}
          role="button"
          aria-pressed={visible.present}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserRoundCheck />
          </div>
          <span className="font-medium text-blue-500">Present</span>
        </div>

        {/* late Stat */}
        <div
          onClick={() => toggleSeries("late")}
          className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${visible.late ? "opacity-100" : "opacity-40 grayscale"
            }`}
          role="button"
          aria-pressed={visible.late}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
            <UserRoundMinus size={20} />
          </div>
          <span className="font-medium text-orange-500">Late</span>
        </div>

        {/* absent Stat */}
        <div
          onClick={() => toggleSeries("absent")}
          className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${visible.absent ? "opacity-100" : "opacity-40 grayscale"
            }`}
          role="button"
          aria-pressed={visible.absent}
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <UserRoundX size={20} />
          </div>
          <span className="font-medium text-red-600">Absent</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-9/13 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={attendance}
            margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#9ca3af",
                strokeWidth: 1,
                strokeDasharray: "4 4"
              }}
            />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorFb)"
              hide={!visible.present}
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="late"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTw)"
              hide={!visible.late}
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorYt)"
              hide={!visible.absent}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const formatTime = time => {
  // Expects HH:MM:SS format
  const [h, m] = time.split(":")
  const hour = parseInt(h, 10)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${suffix}`
}

const calculateDuration = (start, end) => {
  // Treat as UTC to avoid timezone issues when calculating difference
  const startDate = new Date(`1970-01-01T${start}Z`)
  const endDate = new Date(`1970-01-01T${end}Z`)
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffMins = Math.round(diffMs / 60000)

  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60

  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

const ScheduleTimeline = ({ scheduleData, role }) => {
  return (
    <div className={`bg-white h-full rounded-lg p-6 flex flex-col ${role == 'Administrator' || role == 'Instructor' ? "" : "mb-4"}`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
        </div>
      </div>
      <div className="relative grow h-10 overflow-y-auto before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:h-full before:w-0 before:bg-gray-300 scrollbar-none">
        <div className="relative pr-2 scrollbar-none">
          {/* Vertical Line */}
          <div className="absolute left-18 top-2 bottom-0 w-0.5 bg-gray-100" />

          <div className="space-y-6">
            {scheduleData.map(event => {
              const { color } = event.class_course
              const {
                sex,
                first_name,
                Last_name
              } = event.class_course.instructor.user
              const instructorTitle = sex === "M" ? "Mr." : "Ms."
              const instructorName = `${instructorTitle} ${first_name} ${Last_name}`
              const duration = calculateDuration(event.start_time, event.end_time)

              // Create style objects for dynamic colors with opacity
              // Using 6-digit hex + alpha (supported in modern browsers)
              // 15 = ~8% opacity, 33 = ~20% opacity, 40 = ~25% opacity
              const bgStyle = {
                backgroundColor: `${color}25`,
                borderColor: `${color}90`
              }

              return (
                <div key={event.id} className="relative flex items-start group">
                  {/* Time */}
                  <div className="w-16 text-right text-xs font-semibold text-gray-500 pt-3">
                    {formatTime(event.start_time).split(" ")[0]}
                    <span className="block text-[10px] font-normal text-gray-400">
                      {formatTime(event.start_time).split(" ")[1]}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="relative mx-4 flex items-center justify-center pt-3 z-10">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white ring-2"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 0 2px ${color}33`
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-xl p-3 border transition-all hover:shadow-md cursor-default"
                    style={bgStyle}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {event.class_course.course.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin
                            className="w-3.5 h-3.5"
                            style={{ color: color }}
                          />
                          <span className="text-xs text-gray-600 capitalize">
                            {event.room}
                          </span>
                          <span className="text-gray-300">•</span>
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Footer */}
                    <div
                      className="mt-2 flex items-center gap-2 pt-2 border-t"
                      style={{ borderTopColor: `${color}20` }}
                    >
                      <div
                        className="p-1 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {first_name.charAt(0)}
                        {Last_name.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {instructorName}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [instructorCount, setInstructorCount] = useState(null);
  const [attendance, setAttendance] = useState([])
  const [totalHours, setTotalHours] = useState(0)
  const [handledCourses, setHandledCourses] = useState(0)
  const [handledStudents, setHandledStudents] = useState(0)
  const [latestAnnouncements, setLatestAnnouncements] = useState([])
  const [tasks, setTasks] = useState([])
  const [schedule, setSchedule] = useState([]);
  const [year, setYear] = useState(null)
  const [minYear, setMinYear] = useState()
  const [maxYear, setMaxYear] = useState()
  const { user } = useAuth();

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/dashboard`);
      console.log(response.data);
      if (response.data.success) {
        setActiveUsers(response.data.activeUsers)
        setInstructorCount(response.data.instructorCount)
        setStudentCount(response.data.studentCount)
        setTotalHours(response.data.totalHours)
        setHandledStudents(response.data.handledStudents)
        setHandledCourses(response.data.handledSubjects)
        setSchedule(response.data.schedule)
        setLatestAnnouncements(response.data.latestAnnouncements)
        setTasks(response.data.tasks)

      } else {
        throw new Error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/dashboard/attendance/${year}`);
      console.log(response.data);
      if (response.data.success) {
        setAttendance(response.data.attendance);
      } else {
        throw new Error("Failed to load attendance data");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAttendance();
  }, []);

  if (loading) {
    <Preloader />
  }

  return (
    <>
      <div className="flex flex-col h-full w-full gap-4">
        <PageHeader title="Dashboard" />

        <div className="flex flex-row h-auto gap-4">
          <div className="flex flex-col h-auto w-9/13 gap-4">
            {user.roles[0].name == 'Administrator' && (
              <div className="flex flex-row gap-4">
                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CircleUserRound />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Active Users</h1>
                    <p className="font-semibold">{activeUsers}</p>
                  </div>
                </div>

                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                    <Presentation />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Instructors</h1>
                    <p className="font-semibold">{instructorCount}</p>
                  </div>
                </div>

                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <GraduationCap />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Students</h1>
                    <p className="font-semibold">{studentCount}</p>
                  </div>
                </div>
              </div>
            )}

            {user.roles[0].name == 'Instructor' && (
              <div className="flex flex-row gap-4">
                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
                    <Clock4 />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Total Teaching Hours</h1>
                    <p className="font-semibold">{totalHours}</p>
                  </div>
                </div>

                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                    <Presentation />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Handled Classes</h1>
                    <p className="font-semibold">{handledCourses}</p>
                  </div>
                </div>

                <div className="flex p-4 w-full bg-white rounded-lg items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <GraduationCap />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium">Handled Students</h1>
                    <p className="font-semibold">{handledStudents}</p>
                  </div>
                </div>
              </div>
            )}
            {(user.roles[0].name == 'Student' || user.roles[0].name == 'Officer') && (
              <div className="flex flex-col h-fit gap-4 mb-4">
                <div className="bg-white rounded-xl py-4 px-6 w-full min-h-72 ">
                  <h2 className="text-lg font-bold text-gray-900">Tasks</h2>
                  <div className="flex h-11/13 justify-between gap-2 mt-1">
                    <div className="w-full h-full rounded-lg overflow-clip">
                      <div className="flex p-2 bg-red-100 border-b-2 border-red-200">
                        Pending
                      </div>
                      {tasks.overdue?.length > 0 ? (
                        <div className="flex flex-col h-full py-2 px-0.5 gap-3">
                          {tasks.overdue.map(task => (
                            <div className="flex flex-col border-l-4 border-red-400 p-2 rounded-sm gap-1">
                              <h1 className="font-medium truncate">{task.title}</h1>
                              <p className="text-sm text-gray-500 truncate">{task.description}</p>
                              <div className="flex gap-2 items-center">
                                <Clock className="w-4 text-red-500" /><span className="text-xs text-red-500">{task.due_date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center pt-12 h-full gap-3 text-red-400 font-medium text-sm">
                          <SquareCheckBig/>
                          <h1>No upcoming tasks</h1>
                        </div>
                      )}
                    </div>
                    <div className="w-full h-full rounded-lg overflow-clip">
                      <div className="flex p-2 bg-orange-100 border-b-2 border-orange-200">
                        Today
                      </div>
                      {tasks.today?.length > 0 ? (
                        <div className="flex flex-col h-full py-2 px-0.5 gap-3">
                          {tasks.today.map(task => (
                            <div className="flex flex-col border-l-4 border-orange-400 p-2 rounded-sm gap-1">
                              <h1 className="font-medium truncate">{task.title}</h1>
                              <p className="text-sm text-gray-500 truncate">{task.description}</p>
                              <div className="flex gap-2 items-center">
                                <Clock className="w-4 text-orange-500" /><span className="text-xs text-orange-500">{task.due_date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center pt-12 h-full gap-3 text-orange-400 font-medium text-sm">
                          <SquareCheckBig/>
                          <h1>No task due today</h1>
                        </div>
                      )}
                    </div>
                    <div className="w-full h-full rounded-lg overflow-clip">
                      <div className="flex p-2 bg-blue-100 border-b-2 border-blue-200">
                        Upcoming
                      </div>
                      {tasks.upcoming?.length > 0 ? (
                        <div className="flex flex-col h-full py-2 px-0.5 gap-3">
                          {tasks.upcoming.map(task => (
                            <div className="flex flex-col border-l-4 border-blue-400 p-2 rounded-sm gap-1">
                              <h1 className="font-medium truncate">{task.title}</h1>
                              <p className="text-sm text-gray-500 truncate">{task.description}</p>
                              <div className="flex gap-2 items-center">
                                <Clock className="w-4 text-blue-500" /><span className="text-xs text-blue-500">{task.due_date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center pt-12 h-full gap-3 text-blue-400 font-medium text-sm">
                          <SquareCheckBig/>
                          <h1>No upcoming tasks</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col bg-white rounded-lg py-4 px-6 gap-4">
                  <h2 className="text-lg font-bold text-gray-900 mt-1">Recent Announcements</h2>
                  <div className="flex flex-col h-56 mb-4 overflow-y-scroll scrollbar-none gap-3">
                    {latestAnnouncements.map(a => (
                      <div key={a.id} className={`flex border items-center border-gray-200 rounded-md px-4 py-3 gap-4 text-nowrap ${user.roles[0].name == "Administrator" ? "justify-between" : ""}`}>
                        {/* DATETIME */}
                        <div className="flex items-center w-fit h-full gap-4">
                          <div className="flex flex-col w-18 gap-0.5">
                            <div className="flex justify-end truncate">
                              {a.event_date ? dateConverter(a.event_date) : "TBD"}
                            </div>
                            <div className="flex justify-end truncate">
                              {a.event_date ? (a.event_time ? timeConverter(a.event_time) : "All Day") : "TBD"}
                            </div>
                          </div>

                          <div className="border-l-2 border-gray-300 h-9/10" />

                          {/* TITLE + DESC */}
                          <div className="flex flex-col h-15 justify-center gap-1">
                            <div className="text-lg font-medium">{a.title}</div>
                            <div className="text-sm text-gray-600">{a.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {(user.roles[0].name == 'Administrator' || user.roles[0].name == 'Instructor') && (
              <AttendanceChart attendance={attendance} role={user.roles[0].name} />
            )}
          </div>

          <div className="flex flex-col h-full w-4/13 gap-4">
            <div className="flex flex-row w-full h-fit bg-white p-4 rounded-lg justify-between items-center">
              <div className="flex flex-col">
                <div className="font-semibold">{dayjs().format("MMMM D, YYYY")}</div>
                <div className="text-sm">{dayjs().format("dddd")}</div>
              </div>
              <div className="pr-3 pl-5 border-l-3 h-9 border-gray-600 flex items-center justify-center text-gray-600">
                <CalendarDays />
              </div>
            </div>
            <ScheduleTimeline scheduleData={schedule} role={user.roles[0].name}/>
            {console.log(schedule)}
          </div>
        </div>
      </div>
    </>
  );
}

function dateConverter(date) {
  const dateObject = new Date(date);

  // Options for the desired format: "Nov 11 2025" (Note: date in input is Nov 6th)
  const options = {
    // year: 'numeric',
    month: 'short', // "Nov"
    day: 'numeric', // "6"
  };

  // Format the date using the options and a specific locale (e.g., 'en-US')
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);

  // In your JSX:

  return `${formattedDate}`
}

function timeConverter(time) {
  if (time === "24:00:00") {
    return "12:00 AM";
  }

  if (time) {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  }
};