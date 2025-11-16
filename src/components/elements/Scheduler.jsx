import React, { useEffect, useState } from "react";
// import { scheduler } from "node:timers/promises";
import './Scheduler.css'

const WeeklyScheduleGrid = ({ scheduleData }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const startHour = 7;  // 7 AM
  const endHour = 20;   // 8 PM

  // Helper: convert "HH:MM:SS" → numeric hours (e.g. "09:30:00" → 9.5)
  const toHour = (time) => {
    const [h, m] = time.split(":");
    return parseInt(h) + parseInt(m) / 60;
  };

  // Group classes by day
  const classesByDay = days.reduce((acc, day) => {
    acc[day] = scheduleData.filter((cls) => cls.day_of_week === day);
    return acc;
  }, {});

  return (
    <div className="flex flex-col border border-gray-200 font-normal">
      {/* Header Row */}
      <div className="grid-row header">
        <div className="grid-cell time-col"></div>
        {days.map((day) => (
          <div key={day} className="grid-cell day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Time Rows */}
      {Array.from({ length: endHour - startHour }, (_, i) => {
        const hour = startHour + i;
        const label = `${hour.toString().padStart(2, "0")}:00`;
        return (
          <div key={hour} className="grid-row">
            <div className="grid-cell time-col">{label}</div>
            {days.map((day) => {
              const classHere = classesByDay[day].find(
                (cls) => toHour(cls.start_time) <= hour && toHour(cls.end_time) > hour
              );
              if (classHere) {
                return (
                  <div
                    key={day + hour}
                    className="grid-cell class-cell"
                    style={{ backgroundColor: `#${classHere.class_course.color}` }}
                  >
                    <div className="class-info">
                      <strong>Course {classHere.class_course_id}</strong>
                      <div>{classHere.start_time}–{classHere.end_time}</div>
                      <div>{classHere.room}</div>
                    </div>
                  </div>
                );
              } else {
                return <div key={day + hour} className="grid-cell empty-cell"></div>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

// Example container with mock data
export default function Scheduler() {
    const sampleScheduleData = [
    {
        "id": 1,
        "class_course_id": 1,
        "room": "Asynch/Synch",
        "day_of_week": "Monday",
        "start_time": "08:00:00",
        "end_time": "09:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 1,
            "classroom_id": 18,
            "course_id": 1,
            "instructor_id": 1,
            "semester": 1,
            "color": "FFC068",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 2,
        "class_course_id": 2,
        "room": "Asynch/Synch",
        "day_of_week": "Monday",
        "start_time": "09:00:00",
        "end_time": "10:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 2,
            "classroom_id": 18,
            "course_id": 2,
            "instructor_id": 3,
            "semester": 1,
            "color": "FFEE8C",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 3,
        "class_course_id": 3,
        "room": "Asynch/Synch",
        "day_of_week": "Monday",
        "start_time": "10:00:00",
        "end_time": "11:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 3,
            "classroom_id": 18,
            "course_id": 3,
            "instructor_id": 2,
            "semester": 1,
            "color": "8BEFA7",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 4,
        "class_course_id": 4,
        "room": "Asynch/Synch",
        "day_of_week": "Monday",
        "start_time": "14:00:00",
        "end_time": "15:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 4,
            "classroom_id": 18,
            "course_id": 4,
            "instructor_id": 4,
            "semester": 1,
            "color": "D9BBFF",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 7,
        "class_course_id": 2,
        "room": "EFS 402",
        "day_of_week": "Tuesday",
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 2,
            "classroom_id": 18,
            "course_id": 2,
            "instructor_id": 3,
            "semester": 1,
            "color": "FFEE8C",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 8,
        "class_course_id": 1,
        "room": "COMLAB A",
        "day_of_week": "Tuesday",
        "start_time": "13:00:00",
        "end_time": "15:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 1,
            "classroom_id": 18,
            "course_id": 1,
            "instructor_id": 1,
            "semester": 1,
            "color": "FFC068",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 9,
        "class_course_id": 6,
        "room": "EFS 402",
        "day_of_week": "Tuesday",
        "start_time": "17:00:00",
        "end_time": "19:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 6,
            "classroom_id": 18,
            "course_id": 6,
            "instructor_id": 6,
            "semester": 1,
            "color": "FFB8B8",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 10,
        "class_course_id": 4,
        "room": "EFS 402",
        "day_of_week": "Wednesday",
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 4,
            "classroom_id": 18,
            "course_id": 4,
            "instructor_id": 4,
            "semester": 1,
            "color": "D9BBFF",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 11,
        "class_course_id": 7,
        "room": "EFS 402",
        "day_of_week": "Wednesday",
        "start_time": "13:00:00",
        "end_time": "15:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 7,
            "classroom_id": 18,
            "course_id": 7,
            "instructor_id": 7,
            "semester": 1,
            "color": "D5D8E4",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 12,
        "class_course_id": 8,
        "room": "Asynch/Synch",
        "day_of_week": "Wednesday",
        "start_time": "17:00:00",
        "end_time": "19:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 8,
            "classroom_id": 18,
            "course_id": 8,
            "instructor_id": 8,
            "semester": 1,
            "color": "A1ECFF",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 13,
        "class_course_id": 3,
        "room": "EFS 402",
        "day_of_week": "Thursday",
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 3,
            "classroom_id": 18,
            "course_id": 3,
            "instructor_id": 2,
            "semester": 1,
            "color": "8BEFA7",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 14,
        "class_course_id": 6,
        "room": "Asynch/Synch",
        "day_of_week": "Friday",
        "start_time": "17:00:00",
        "end_time": "18:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 6,
            "classroom_id": 18,
            "course_id": 6,
            "instructor_id": 6,
            "semester": 1,
            "color": "FFB8B8",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    },
    {
        "id": 15,
        "class_course_id": 8,
        "room": "COMLAB A",
        "day_of_week": "Saturday",
        "start_time": "08:00:00",
        "end_time": "11:00:00",
        "created_at": null,
        "updated_at": null,
        "class_course": {
            "id": 8,
            "classroom_id": 18,
            "course_id": 8,
            "instructor_id": 8,
            "semester": 1,
            "color": "A1ECFF",
            "created_at": null,
            "updated_at": null
        },
        "instructor": null
    }
];

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    setSchedule(sampleScheduleData);
  }, []);

  return (
    <div className="app">
      {schedule.length > 0 ? (
        <WeeklyScheduleGrid scheduleData={schedule} />
      ) : (
        <p>Loading schedule...</p>
      )}
    </div>
  );
};

