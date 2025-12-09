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
import { useState, useEffect, Fragment } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timeConverter from './timeConverter';
import Modal from './Modal';
import ViewEventModal from '../modals/ViewEventModal';
import EditCalendarEventForm from '../forms/EditCalendarEventForm';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function CalendarRadio({ activeTab = "month", handleTabChange = () => { } }) {

    const neutral = "flex border border-blue-400 py-2 px-4 text-blue-400"
    const active = "border border-blue-400 bg-blue-400 text-white"
    return (
        <div className='flex'>
            <NavLink to={'#'} end className={`rounded-l-md ${neutral} ${activeTab == 'month' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('month')}>
                <CalendarViewMonthOutlinedIcon fontSize='small' />
            </NavLink>
            <NavLink to={'#'} end className={`${neutral} ${activeTab == 'week' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('week')}>
                <CalendarViewWeekOutlinedIcon fontSize='small' />
            </NavLink>
            <NavLink to={'#'} end className={`${neutral} ${activeTab == 'day' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('day')}>
                <CalendarViewDayOutlinedIcon fontSize='small' />
            </NavLink>
            <NavLink to={'#'} end className={`rounded-r-md ${neutral} ${activeTab == 'list' ? active : 'hover:bg-blue-50'}`} onClick={() => handleTabChange('list')}>
                <ListAltOutlinedIcon fontSize='small' />
            </NavLink>
        </div>

    )
}

export default function Calendar({ fetchEvents, events, loading }) {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [activeTab, setActiveTab] = useState('month');

    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const startDate = startOfMonth.startOf("week");

    const days = [];
    for (let i = 0; i < 42; i++) {
        days.push(startDate.add(i, "day"));
    }

    const weeks = [];
    for (let i = 0; i < 42; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div>
            <div className="flex pl-4 py-4 items-center gap-4 pr-1">
                <div className="flex gap-2 items-center">
                    <button className="cursor-pointer" onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}><KeyboardArrowLeftOutlinedIcon /></button>
                    <p className="text-lg font-medium">{currentMonth.format("MMM YYYY")}</p>
                    <button className="cursor-pointer" onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}><KeyboardArrowRightOutlinedIcon /></button>
                </div>

                <div className="flex w-full" />
                <button onClick={() => setCurrentMonth(dayjs())} className="flex h-fit w-fit px-4 py-2 border rounded-md gap-2 items-center border-blue-400 text-blue-400 text-sm font-medium hover:bg-blue-50">
                    Today
                </button>
                <CalendarRadio activeTab={activeTab} handleTabChange={handleTabChange} />
            </div>

            {loading ? (
                <div className="h-full">Loading events...</div>
            ) : (
                <>
                    {activeTab === "month" && <MonthView fetchEvents={fetchEvents} weeks={weeks} events={events} currentMonth={currentMonth} />}
                    {activeTab === "week" && <WeekView events={events} currentDay={currentMonth} />}
                    {activeTab === "day" && <DayView events={events} currentDay={currentMonth} />}
                    {activeTab === "list" && <ListView weeks={weeks} events={events} currentMonth={currentMonth} />}
                </>
            )}
        </div>
    );
}

function MonthView({ fetchEvents, weeks, events, currentMonth }) {
    return (
        <div className='border rounded-md p-4 border-gray-200'>
            <div className='bg-slate-100 grid grid-cols-7 border border-gray-200 divide-x divide-gray-200 text-sm font-semibold'>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="flex w-full h-full justify-center p-4">{d}</div>
                ))}
            </div>
            <div className="">
                {weeks.map((week, i) => (<WeekRow fetchEvents={fetchEvents} key={i} week={week} events={events} month={currentMonth} />))}
            </div>
        </div>
    )
}

function WeekView({ events, currentDay }) {
    const [allDayEventCount, setAllDayEventCount] = useState(1);
    const dayOfWeek = currentDay.day();
    const sunday = currentDay.subtract(dayOfWeek, "day");

    const week = Array.from({ length: 7 }, (_, i) => sunday.add(i, "day").clone());

    const weekStart = week[0];
    const weekEnd = week[6];

    const SLOT_PX = 24;
    const slotPxStr = `${SLOT_PX}px`;

    const timeSlots = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour.toString().padStart(2, "0")}:${minute}`;
    });

    const allDayEvents = events.filter(e => {
        const start = dayjs(e.start);
        const end = dayjs(e.end);

        const isMultiDay = !start.isSame(end, "day");
        return e.allDay || isMultiDay;
    });

    const occupied = Array(7).fill(0);

    const laidOutAllDay = allDayEvents.filter(e => {
        const start = dayjs(e.start);
        const end = dayjs(e.end);
        return !(end.isBefore(weekStart) || start.isAfter(weekEnd));
    }).sort((a, b) => dayjs(a.start).diff(dayjs(b.start))).map(e => {
        const start = dayjs(e.start);
        const end = dayjs(e.end);

        const effectiveStart = start.isBefore(weekStart) ? weekStart : start;
        const effectiveEnd = end.isAfter(weekEnd) ? weekEnd : end;

        const startCol = effectiveStart.day();
        const endCol = effectiveEnd.day();

        const slot = Math.max(...occupied.slice(startCol, endCol + 1)) + 1;

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

    const maxAllDaySlots = Math.max(1, ...occupied);

    const timedEvents = events.filter(event => !event.allDay);

    const laidOutTimed = timedEvents.flatMap((event) => {
        const start = dayjs(event.start);
        const end = dayjs(event.end);

        if (end.isBefore(weekStart) || start.isAfter(weekEnd)) return [];

        const dayIndex = start.day();

        const timeStart = dayjs(event.timeStart, "HH:mm:ss");
        const timeEnd = event.timeEnd ? dayjs(event.timeEnd, "HH:mm:ss") : timeStart.add(1, "hour");

        const startSlot = timeStart.hour() * 2 + (timeStart.minute() >= 30 ? 2 : 1);
        const endSlot = timeEnd.hour() * 2 + (timeEnd.minute() >= 30 ? 2 : 1);

        const span = Math.max(1, endSlot - startSlot);

        return {
            ...event,
            dayIndex,
            startSlot,
            span
        };
    });



    return (
        <div className="flex flex-col border rounded-md p-4 border-gray-200 overflow-hidden h-fit">
            <div className="bg-slate-100 grid grid-cols-[60px_repeat(7,1fr)] border border-gray-200 divide-x divide-gray-200 text-sm font-semibold sticky top-0 z-10">
                <div className="bg-slate-100" />
                {week.map(day => (
                    <div key={day.toString()} className="flex justify-center p-4">
                        {day.format("ddd D")}
                    </div>
                ))}
            </div>

            <div className="relative grid grid-cols-[60px_repeat(7,1fr)] border-x border-b border-gray-200">
                <div className="flex justify-center items-center text-xs font-medium bg-slate-100 border-r border-gray-200">
                    All day
                </div>

                {week.map((day, i) => (
                    <div key={day.toString()} className={`border-r border-gray-200 p-2 ${day.isSame(dayjs(), "day") ? "bg-violet-100" : ""}`}>
                        <div style={{ height: `${maxAllDaySlots * 1.4}rem` }} />
                    </div>
                ))}

                <div className="absolute inset-0 grid grid-cols-[60px_repeat(7,1fr)] gap-y-1 auto-rows-min pointer-events-none">
                    <div />
                    {laidOutAllDay.map(event => (
                        <div key={event.id}
                            className="bg-blue-100 h-5 mx-1 border-l-4 border-blue-500 rounded-sm px-1 text-xs flex items-center pointer-events-auto"
                            style={{
                                gridColumnStart: event.startCol + 2,  // +2 because column 1 = label
                                gridColumnEnd: `span ${event.span}`,
                                gridRowStart: event.slot + 1,
                            }}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-gray-200 h-100 overflow-y-scroll scrollbar-none border-l border-b border-gray-200" style={{ gridAutoRows: slotPxStr }}>
                <div className='bg-slate-100 p-1'>&nbsp;</div>
                {week.map(day => (
                    <div key={day.toString()} className={`${day.isSame(dayjs(), "day") ? "bg-violet-100" : ""}`} />
                ))}
                <div className='bg-slate-100 border-b border-gray-200 p-1'>&nbsp;</div>
                {week.map(day => (
                    <div key={day.toString()} className={`border-b border-gray-200 ${day.isSame(dayjs(), "day") ? "bg-violet-100" : ""}`} />
                ))}

                {timeSlots.map((time, i) => (
                    <Fragment key={time}>
                        {i % 2 == 1 ? null : (
                            <div className="relative flex text-xs overflow-visible justify-center items-center font-medium bg-slate-100 border-b border-gray-200" style={{ gridRow: `span 2` }}>
                                <div className='absolute overflow-visible -top-2 bg-slate-100 px-1'>
                                    {time}
                                </div>
                            </div>
                        )}

                        {week.map(day => (
                            <div key={day.toString() + time} className={`${i % 2 === 1 ? "border-b border-gray-200" : ""}  ${day.isSame(dayjs(), "day") ? "bg-violet-100" : ""}`} />
                        ))}
                    </Fragment>
                ))}

                <div className="absolute inset-0 grid grid-cols-[60px_repeat(7,minmax(0,1fr))] pointer-events-none" style={{ gridAutoRows: slotPxStr }}>
                    {laidOutTimed.map(event => (
                        <div key={event.id}
                            className="bg-blue-100 w-full border-l-4 border-blue-500 text-xs p-1 rounded-sm pointer-events-auto cursor-pointer"
                            style={{
                                gridColumn: event.dayIndex + 2,
                                gridRowStart: event.startSlot + 2,
                                gridRowEnd: `span ${event.span}`,
                            }}
                        >
                            <div className='flex flex-col gap-1 w-full h-full overflow-hidden'>
                                <p className='flex truncate'>{event.title}</p>
                                <p>{event.timeStart} – {event.timeEnd ? event.timeEnd : 'TBD'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DayView({ events, currentDay }) {
    return (
        <div className='border rounded-md p-4 border-gray-200'>
            Day View
        </div>
    )
}

function ListView({ weeks, events, currentMonth }) {
    return (
        <div className='border rounded-md p-4 border-gray-200'>
            List View
        </div>
    )
}

function WeekRow({ fetchEvents, week, events, month }) {
    const weekStart = week[0];
    const weekEnd = week[6];
    const [openEventModal, setOpenEventModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState()

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

            {week.map(d => (
                <div key={d.format("YYYY-MM-DD")} className={`border-r border-gray-200 ${d.month() != month.month() ? 'text-gray-300' : 'text-black'}`}>
                    <div className={`h-fit m-1 rounded-sm p-1 text-right text-sm ${d.isSame(dayjs(), "day") ? "bg-violet-100 font-medium " : ""}`}>
                        {d.date()}
                    </div>
                    <div style={{ height: `${maxSlot * rowHeight}rem` }} />
                </div>
            ))}

            <div className="absolute inset-0 grid grid-cols-7 auto-rows-min gap-y-1 pointer-events-none">
                <div className="h-6 m-1 rounded-sm p-1 text-right text-sm " />
                {weekEvents.map(event => (
                    <div
                        onClick={() => { setOpenEventModal(true); setSelectedEvent(event) }}
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
            <Modal open={openEventModal} onClose={() => setOpenEventModal(false)} title="Event Details">
                <ViewEventModal
                    event={selectedEvent}
                    onClose={() => setOpenEventModal(false)}
                    onEdit={() => {
                        setOpenEventModal(false);
                        setTimeout(() => setOpenEditModal(true), 10);
                    }}
                    onDelete={() => {
                        setOpenEventModal(false);
                        setTimeout(() => setOpenDeleteModal(true), 10);
                    }}
                />
            </Modal>
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)} title={`Edit ${selectedEvent?.title}`}>
                <EditCalendarEventForm event={selectedEvent} onSuccess={fetchEvents} onClose={() => setOpenEditModal(false)} />
            </Modal>
        </div>
    );
}

