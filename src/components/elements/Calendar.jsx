import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import CalendarViewWeekOutlinedIcon from '@mui/icons-material/CalendarViewWeekOutlined';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { PrimaryButtonOutlined } from './Buttons';
import { NavLink } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios"
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timeConverter from './timeConverter';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function CalendarRadio() {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
    }

    const neutral = "flex border border-blue-400 py-2 px-4 text-blue-400"
    const active = "border border-blue-400 bg-blue-400 text-white"
    return (
        <div className='flex'>
            <NavLink to={'#'} end className={`rounded-l-md ${neutral} ${activeTab == 'tab1' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('tab1')}>
                <CalendarViewMonthOutlinedIcon fontSize='small'/>
            </NavLink>
            <NavLink to={'#'} end className={`${neutral} ${activeTab == 'tab2' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('tab2')}>
                <CalendarViewWeekOutlinedIcon fontSize='small'/>
            </NavLink>
            <NavLink to={'#'} end className={`${neutral} ${activeTab == 'tab3' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('tab3')}>
                <CalendarViewDayOutlinedIcon fontSize='small'/>
            </NavLink>
            <NavLink to={'#'} end className={`rounded-r-md ${neutral} ${activeTab == 'tab4' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('tab4')}>
                <ListAltOutlinedIcon fontSize='small'/>
            </NavLink>
        </div>
        
    )
}

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const fetchEvents = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get("/calendar");
            console.log(response.data)
            if (response.data.success) {
                const mapped = response.data.schedules.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    start: event.start_date,
                    end: event.end_date ?? event.start_date,
                    allDay: event.all_day === 1,
                    timeStart: event.start_time,
                    timeEnd: event.end_time,
                    repeats: event.repeats,
                    category: event.category,
                    targets: event.targets
                }));
                setEvents(mapped);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [])

    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    // Start from the beginning of the first week that contains the 1st
    const startDate = startOfMonth.startOf("week");

    // Always show 6 rows of weeks = 42 days
    const days = [];
    for (let i = 0; i < 42; i++) {
    days.push(startDate.add(i, "day"));
    }

    // Now chunk into weeks
    const weeks = [];
    for (let i = 0; i < 42; i += 7) {
    weeks.push(days.slice(i, i + 7));
    }

    return (
        <div>
            <div className="flex p-4 items-center gap-4">
                <div className='flex gap-2 items-center'>
                    <button className='cursor-pointer' onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}><KeyboardArrowLeftOutlinedIcon /></button>
                    <p className="text-lg font-medium">{currentMonth.format("MMM YYYY")}</p>
                    <button className='cursor-pointer' onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}><KeyboardArrowRightOutlinedIcon /></button>
                </div>
                <div className='flex w-full'/>
                <PrimaryButtonOutlined>Today</PrimaryButtonOutlined>
                <CalendarRadio />
            </div>

            <div className='border rounded-md p-4 border-gray-200'>

                    <div className='bg-gray-100 grid grid-cols-7 border border-gray-200 divide-x divide-gray-200 text-sm font-semibold'>
                        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                            <div key={d} className="flex w-full h-full justify-center p-4">{d}</div>
                        ))}
                    </div>

                <div className="">
                    {weeks.map((week, i) => (<WeekRow key={i} week={week} events={events} month={currentMonth} />))}
                </div>
            </div>
        </div>
    );
}

function WeekRow({ week, events, month }) {
    const weekStart = week[0];
    const weekEnd = week[6];

    // Track rows (slots)
    const occupied = Array(7).fill(0);

    // Filter, sort, and compute layout
    const weekEvents = events
        .filter(e => {
            const start = dayjs(e.start);
            const end = dayjs(e.end);
            return !(end.isBefore(weekStart) || start.isAfter(weekEnd));
        })
        .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
        .map(e => {
            const start = dayjs(e.start);
            const end = dayjs(e.end);

            const effectiveStart = start.isBefore(weekStart) ? weekStart : start;
            const effectiveEnd = end.isAfter(weekEnd) ? weekEnd : end;

            const startCol = effectiveStart.day();
            const endCol = effectiveEnd.day();

            // get row slot
            const slot = Math.max(...occupied.slice(startCol, endCol + 1)) + 1;

            // mark columns
            for (let i = startCol; i <= endCol; i++) {
                occupied[i] = slot;
            }

            return {
                ...e,
                startCol,
                span: endCol - startCol + 1,
                slot
            };
        });

    // Number of rows needed
    const maxSlot = Math.max(0, ...occupied);
    const rowHeight = 1.6; // rem per event row

    return (
        <div className="relative border-l border-b border-gray-200 grid grid-cols-7 min-h-24">

            {/* Day cells */}
            {week.map(d => (
                <div key={d.format("YYYY-MM-DD")} className={`border-r border-gray-200 ${d.month() != month.month()? 'text-gray-300' : ''}`}>
                    <div className={`h-1/4 m-1 rounded-sm p-1 text-right text-sm ${d.isSame(dayjs(), "day") ? "bg-violet-100 font-medium " : ""}`}>
                        {d.date()}
                    </div>

                    {/* event space */}
                    <div style={{ height: `${maxSlot * rowHeight}rem` }} />
                </div>
            ))}

            {/* Event bars */}
            <div className="absolute inset-0 grid grid-cols-7 auto-rows-min gap-y-1 pointer-events-none">
                <div className="h-5 m-1 rounded-sm p-1 text-right text-sm "/>
                {weekEvents.map(event => (
                    <div
                        key={event.id}
                        className="flex bg-blue-100 h-5 mx-1 border-l-4 border-blue-500 rounded-sm px-1 text-xs items-center pointer-events-auto cursor-pointer"
                        style={{
                            gridColumnStart: event.startCol + 1,
                            gridColumnEnd: `span ${event.span}`,
                            gridRowStart: event.slot + 1,
                        }}
                        title={event.title}
                    >
                        <span className='w-fit truncate'>{event.allDay ? "" : timeConverter(event.timeStart)} {event.title}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}

