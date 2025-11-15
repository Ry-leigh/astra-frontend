import api from "@/api/axios"
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
import weekday from "dayjs/plugin/weekday";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);

import ErrorRoute from "@/router/ErrorRoute";

import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckOutlinedRoundedIcon from '@mui/icons-material/CheckOutlined';
import { PrimaryButtonOutlined, EditButton, DeleteButton } from '@/components/elements/Buttons';

export function ClassIndex({ enrollees, role }) {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl scrollbar-none">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="sticky top-0 bg-white">
                    <tr className="">
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Role</th>
                        {(role === 'Administrator') && (
                            <th className="px-4 py-3 pt-6 text-center font-semibold text-gray-700">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {enrollees.length > 0 ? (
                        enrollees.map((enrollee) => (
                        <tr key={enrollee.id} className="hover:bg-zinc-50 transition">
                            <td className="px-4 py-3 text-gray-900">
                                {enrollee.student.user.last_name}, {enrollee.student.user.first_name}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{enrollee.student.user.email}</td>
                            <td className="px-4 py-3 text-gray-700">{enrollee.student.user.roles[0].name}</td>
                            {(role === 'Administrator') && (
                                <td className="px-4 py-3 text-center space-x-3">
                                    <EditButton size="small"/>
                                    <DeleteButton size="small"/>
                                </td>
                            )}
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                                No enrollees found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export function ClassAttendance({ role = '', date = ''}) {
    const { classCourseId } = useParams();
    const formattedDate = date || '';
    const [session, setSession] =useState({});
    const [attendanceRecords, setAttendanceRecords] =useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRecordAttendance = async ({ classCourseId, id, status, time_in = null, remarks = null}) => {
        try {
            const response = await api.patch(`/class/${classCourseId}/attendance/${id}`, {
                status, time_in, remarks
            });
            console.log("Attendance updated:", response.data, status, id, classCourseId);
        } catch (error) {
            console.error("Error recording attendance:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false)
        }
    }

    function AttendanceOptions ({ classId, attendanceId, status, setAttendanceRecords }) {
        const [open, setOpen] = useState(false);
        const [saving, setSaving] = useState(false);
        const [saved, setSaved] = useState(false);
        const popoverRef = useRef(null);
        const buttonRef = useRef(null);

        useEffect(() => {
            function handleClickOutside(e) {
                if (popoverRef.current && !popoverRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
                    setOpen(false);
                }
            }

            if (open) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [open]);

        const handleSelect = async (newStatus) => {
            setOpen(false);
            setSaving(true);
            
            await handleRecordAttendance({
                classCourseId: classId,
                id: attendanceId,
                status: newStatus
            });

            setAttendanceRecords(prev =>
                prev.map(record =>
                    record.id === attendanceId
                        ? { ...record, status: newStatus }
                        : record
                )
            );

            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
        }

            let bg
            
            switch (status) {
                case 'present':
                    bg = "bg-green-100";
                    break;
                case 'late':
                    bg = "bg-orange-100";
                    break;
                case 'absent':
                    bg = "bg-red-100";
                    break;
                case 'excused':
                    bg = "bg-blue-100";
                    break;
                case 'suspended':
                    bg = "bg-black text-white";
                    break;
                default:
                    bg = "bg-white"
                    break;
            }

        return (
            <div className="relative w-1/3">
                <button ref={buttonRef} onClick={() => setOpen(!open)} className={`flex items-center py-1 px-2 justify-between w-full border border-gray-200 rounded-md ${bg}`}>
                    <span className="capitalize">{status}</span>

                    {open ? (
                        <div className="text-zinc-800/40"><KeyboardArrowUpIcon /></div>
                    ) : saving ? (
                        <div className="w-1/5 m-[0.18rem] aspect-square border-3 border-l-transparent border-zinc-800/40 rounded-full animate-spin"/>
                    ) : saved ? (
                        <div className="text-zinc-800/40"><CheckOutlinedRoundedIcon/></div>
                    ) : (
                        <div className="text-zinc-800/40"><KeyboardArrowDownIcon /></div>
                    )}

                </button>

                {/* Dropdown */}
                {open && (
                    <div ref={popoverRef} className="absolute left-0 top-full w-full bg-white shadow rounded-md z-10">
                        {["present", "late", "absent", "excused", "suspended"].map((s) => (
                            <div key={s} onClick={() => handleSelect(s)} className="p-2 text-center hover:bg-gray-100 cursor-pointer capitalize">
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const fetchAttendance = async () => {
        try {
            const response = await api.get(`/class/${classCourseId}/attendance/${formattedDate}`);
            if(response.data.success){
                console.log(response.data);
                setSession(response.data.session)
                setAttendanceRecords(response.data.attendance_records)
            } else {
                throw new Error("Failed to load attendance records");
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendance();
    },[classCourseId, date])

    const handlePreviousSessionRequest = async (date = `${session?.session_date}`) => {
        setLoading(true);
        try {
            const response = await api.get(`/class/${classCourseId}/attendance/${date}/previous`);
            if(response.data.success){
                console.log(response.data);
                setSession(response.data.session)
                setAttendanceRecords(response.data.attendance_records)
            } else {
                throw new Error("Failed to load attendance records");
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false)
        }
    }

    const handleNextSessionRequest = async (date = `${session?.session_date}`) => {
        setLoading(true);
        try {
            const response = await api.get(`/class/${classCourseId}/attendance/${date}/next`);
            if(response.data.success){
                setSession(response.data.session)
                setAttendanceRecords(response.data.attendance_records)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false)
        }
    }

    if (error) return <ErrorRoute code={error} />;

    if (loading) return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs p-6 rounded-xl gap-2">
            Loading attendance records...
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs pt-6 pb-4 px-6 rounded-xl gap-3">
            <div className="flex justify-between items-center gap-4">
                <div className='flex gap-2 items-center text-lg'>
                    <button className="cursor-pointer" onClick={() => handlePreviousSessionRequest(session?.session_date)}>
                        <KeyboardArrowLeftOutlinedIcon />
                    </button>
                    <p className="flex text-lg font-medium text-nowrap">{session?.session_date? dayjs(session.session_date).format("MMM D") : ''}</p>
                    <button className="cursor-pointer" onClick={() => handleNextSessionRequest(session.session_date)}>
                        <KeyboardArrowRightOutlinedIcon />
                    </button>
                    <p className="text-base">{session?.class_schedule?.day_of_week || dayjs(session?.session_date).format("dddd") || '--'} | {session?.class_schedule?.start_time? dayjs(session.class_schedule.start_time, "HH:mm:ss").format("h:mm") : session?.calendar_schedule?.start_time? dayjs(session.calendar_schedule.start_time, "HH:mm:ss").format("h:mm") : '--'} – {session?.class_schedule?.end_time ? dayjs(session.class_schedule.end_time, "HH:mm:ss").format("h:mm") : session?.calendar_schedule?.end_time ? dayjs(session.calendar_schedule.end_time, "HH:mm:ss").format("h:mm") : '--'}</p>
                </div>
            </div>
            
            <div className="flex gap-4 px-2 text-base">
                <div className="flex gap-2 items-center">
                    <p className="font-medium">Time in:</p><p className="font-light">{session?.time_in || '--'}</p><EditButton/>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="font-medium">Time out:</p><p className="font-light">{session?.time_out || '--'}</p><EditButton/>
                </div>
            </div>

            {/* <div className="flex flex-nowrap mt-4 px-2 items-center gap-2 text-sm">Mark selected as: <PrimaryButtonOutlined>Present</PrimaryButtonOutlined></div> */}
            
            <div className="flex overflow-y-auto scrollbar-none mx-2">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="sticky top-0 bg-white z-2">
                        <tr className="">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                        {attendanceRecords?.length > 0 ? (
                            attendanceRecords.map((enrollee) => (
                            <tr key={enrollee.id} className="hover:bg-zinc-50 transition">
                                <td className="px-4 py-3 text-gray-900">
                                    {enrollee.student.user.last_name}, {enrollee.student.user.first_name}
                                </td>
                                <td className="px-4 py-3 text-gray-700"><AttendanceOptions classId={classCourseId} attendanceId={enrollee.id} status={enrollee?.status} setAttendanceRecords={setAttendanceRecords}/></td>
                                <td className="px-4 py-3 text-gray-700">{enrollee.remarks || "..."}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                                    No enrollees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function ClassTask({ role = ''}) {
    const { classCourseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState({});

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/class/${classCourseId}/tasks`);
            if(response.data.success){
                setTasks(response.data.tasks);
            } else {
                throw new Error("Failed to load tasks");
            }
        } catch (error) {
            console.error("Error fetching class:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    },[classCourseId])

    if (loading) return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs p-6 rounded-xl gap-2">
            Loading tasks...
        </div>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="sticky top-0 bg-white">
                    <tr className="">
                        <th className="py-3 pt-6 text-left font-semibold text-gray-700"></th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Due</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Category</th>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <th className="px-4 py-3 pt-6 text-center font-semibold text-gray-700">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {tasks.overdue?.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50 transition">
                        <td className="px-4 py-3 text-gray-900">
                            <div className="h-10 w-2 bg-blue-500"/>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{task.title}</td>
                        <td className="px-4 py-3 text-gray-700">{task.description}</td>
                        <td className="px-4 py-3 text-gray-700">{task.due_date? `${task.due_date} | ${task.due_time}` : '--'}</td>
                        <td className="px-4 py-3 text-gray-700">{task.category}</td>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <td className="px-4 py-3 text-center space-x-3">
                                <EditButton size="small" />
                                <DeleteButton size="small" />
                            </td>
                        )}
                    </tr>
                    ))}
                    {tasks.today.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50 transition">
                        <td className="py-4 text-gray-900">
                            <div className="h-10 w-2 bg-blue-500 rounded-full"/>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{task.title}</td>
                        <td className="px-4 py-3 text-gray-700">{task.description}</td>
                        <td className="px-4 py-3 text-gray-700">{task.due_date? `${task.due_date} ${task.due_time? `| ${task.due_time}` : ''}` : '--'}</td>
                        <td className="px-4 py-3 text-gray-700">{task.category}</td>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <td className="px-4 py-3 text-center space-x-3">
                                <EditButton size="small" />
                                <DeleteButton size="small" />
                            </td>
                        )}
                    </tr>
                    ))}
                    {tasks.upcoming.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50 transition">
                        <td className="px-4 py-3 text-gray-900">
                            <div className="h-10 w-2 bg-blue-500"/>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{task.title}</td>
                        <td className="px-4 py-3 text-gray-700">{task.description}</td>
                        <td className="px-4 py-3 text-gray-700">{task.due_date? `${task.due_date} | ${task.due_time}` : '--'}</td>
                        <td className="px-4 py-3 text-gray-700">{task.category}</td>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <td className="px-4 py-3 text-center space-x-3">
                                <EditButton size="small" />
                                <DeleteButton size="small" />
                            </td>
                        )}
                    </tr>
                    ))}
                    {tasks.finished.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50 transition">
                        <td className="px-4 py-3 text-gray-900">
                            <div className="h-10 w-2 bg-blue-500 rounded-full"/>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{task.title}</td>
                        <td className="px-4 py-3 text-gray-700">{task.description}</td>
                        <td className="px-4 py-3 text-gray-700">{task.due_date? `${task.due_date} | ${task.due_time}` : '--'}</td>
                        <td className="px-4 py-3 text-gray-700">{task.category}</td>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <td className="px-4 py-3 text-center space-x-3">
                                <EditButton size="small" />
                                <DeleteButton size="small" />
                            </td>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function ClassAnnouncement({ role = '' }) {
    const { classCourseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [announcements, setAnnouncements] = useState({});

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get(`/class/${classCourseId}/announcements`);
            if(response.data.success){
                setAnnouncements(response.data.announcements);
            } else {
                throw new Error("Failed to load announcements");
            }
        } catch (error) {
            console.error("Error fetching class:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    },[classCourseId])

    if (loading) return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs p-6 rounded-xl gap-2">
            Loading class announcements...
        </div>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="sticky top-0 bg-white">
                    <tr className="">
                        <th className="py-3 pt-6 text-left font-semibold text-gray-700"></th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Due</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Category</th>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <th className="px-4 py-3 pt-6 text-center font-semibold text-gray-700">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {announcements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-zinc-50 transition">
                        <td className="py-4 text-gray-900">
                            <div className="h-10 w-2 bg-blue-500 rounded-full"/>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{announcement.title}</td>
                        <td className="px-4 py-3 text-gray-700">{announcement.description}</td>
                        <td className="px-4 py-3 text-gray-700">{announcement.due_date? `${announcement.due_date} ${announcement.due_time? `| ${announcement.due_time}` : ''}` : '--'}</td>
                        <td className="px-4 py-3 text-gray-700">{announcement.category}</td>
                        {(role === 'Administrator' || role === 'Instructor') && (
                            <td className="px-4 py-3 text-center space-x-3">
                                <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-gray-800 hover:bg-gray-200 transition" onClick={() => console.log("Edit", enrollee.student.user.id)}>
                                    Edit
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-red-600 hover:bg-red-100 transition" onClick={() => console.log("Delete", enrollee.student.user.id)}>
                                    Delete
                                </button>
                            </td>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}