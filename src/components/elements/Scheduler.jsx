import api from "@/api/axios";
import { useEffect, useState, Fragment } from "react";

export default function Scheduler() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const START = 7;   // 7 AM
  const END = 19;    // 7 PM
  const SLOT_PX = 96;
  const GRID_COLS = "60px repeat(7, minmax(0,1fr))";
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  const slotPxStr = `${SLOT_PX}px`;

  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/schedule");
      if (res.data.success) {
        setSchedule(res.data.schedule);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const laidOutTimed = schedule.map((item) => {
    const dayIndex = DAYS.indexOf(item.day_of_week);
    const start = parseTime(item.start_time);
    const end = parseTime(item.end_time);

    return {
      ...item,
      dayIndex,
      startSlot: start - START,
      span: Math.max(1, end - start)
    };
  });

  return (
    <div className="flex flex-col border rounded-md p-4 border-gray-200 h-fit overflow-hidden">

      {/* HEADER */}
      <div
        className="grid bg-slate-100 border border-gray-200 divide-x divide-gray-200 text-sm font-semibold"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        <div></div>
        {DAYS.map((d) => (
          <div key={d} className="flex justify-center p-4">
            {d}
          </div>
        ))}
      </div>

      {/* TIMED GRID */}
      <div
        className="relative grid divide-x divide-gray-200 border-l border-b border-gray-200 overflow-y-scroll scrollbar-none"
        style={{
          gridTemplateColumns: GRID_COLS,
          gridAutoRows: slotPxStr
        }}
      >
        {/* Time column */}
        {hours.map((h) => (
          <Fragment key={h}>
            <div className="bg-slate-100 border-b border-gray-200 flex items-start justify-center text-xs py-2">
              {h}:00
            </div>

            {/* 7 day columns */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i + "-" + h} className="border-b border-gray-200"></div>
            ))}
          </Fragment>
        ))}

        {/* ABSOLUTE SCHEDULE EVENTS */}
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: GRID_COLS,
            gridAutoRows: slotPxStr
          }}
        >
          {laidOutTimed.map((event) => (
            <div
              key={event.id}
              className="bg-blue-100 border-l-4 border-blue-500 text-xs p-1 rounded-sm pointer-events-auto cursor-pointer overflow-hidden min-w-0"
              style={{
                gridColumn: event.dayIndex + 2,
                gridRowStart: event.startSlot + 1,
                gridRowEnd: `span ${event.span}`
              }}
            >
              <p className="truncate">{event.title}</p>
              <p className="truncate">
                {event.start_time} – {event.end_time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
