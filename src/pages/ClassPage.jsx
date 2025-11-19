import api from "../api/axios"
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import ErrorRoute from "@/router/ErrorRoute";
import ClassPreloader from "@/components/preloaders/ClassPreloader";
import Layout from "@/components/layout/Layout";
import { PrimaryButton, EditButton } from "@/components/elements/Buttons";
import { ClassIndex, ClassAttendance, ClassTask, ClassAnnouncement } from "@/components/elements/ClassContents";

function Header({ course = { name: '' }, instructor = { first_name: '', last_name: '', sex: '' }, role = '', activeTab = 'students', handleTabChange = () => {}, children }) {
    const neutral = "flex gap-3 items-center mx-2 py-4 px-6 pt-7";
    const active = "font-medium text-blue-500 border-b-3";
    const inactive = "text-gray-500 border-gray-500/0 border-b-3 hover:text-blue-400";

    return (
        <div className="flex flex-col bg-white w-full shadow-xs pt-6 px-6 rounded-xl">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2 px-2">
                    <div className="flex items-center gap-2">
                        <h1 className="flex font-semibold text-2xl">{course.name}</h1>
                        {(role === 'Administrator') && (
                            <EditButton size="small"/>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p>{instructor.sex == 'M' ? 'Mr. ' : (instructor.sex == 'F' ? 'Ms. ' : '')} {instructor.first_name} {instructor.last_name}</p>
                        {(role === 'Administrator') && (
                            <EditButton />
                        )}
                    </div>
                </div>
                {children}
            </div>
            <div className="flex w-full items-end justify-between">
                <div className="flex">
                    <NavLink to="#" end className={`${neutral} ${activeTab === "students" ? active : inactive}`} onClick={() => handleTabChange("students")}>
                        <h2>Students</h2>
                    </NavLink>

                    <NavLink to="#" end className={`${neutral} ${activeTab === "attendance" ? active : inactive}`} onClick={() => handleTabChange("attendance")}>
                        <h2>Attendance</h2>
                    </NavLink>

                    <NavLink to="#" end className={`${neutral} ${activeTab === "tasks" ? active : inactive}`} onClick={() => handleTabChange("tasks")}>
                        <h2>Tasks</h2>
                    </NavLink>

                    <NavLink to="#" end className={`${neutral} ${activeTab === "announcements" ? active : inactive}`} onClick={() => handleTabChange("announcements")}>
                        <h2>Announcements</h2>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

function IndexTab({ classCourseId, role }) { return <ClassIndex classCourseId={classCourseId} role={role} /> }
function AttendanceTab({ role = '', date = '' }) { return <ClassAttendance role={role} date={date} /> }
function TaskTab({ role = '' }) { return <ClassTask role={role} /> }
function AnnouncementTab({ role = '' }) { return <ClassAnnouncement role={role}/> }

export default function ClassPage() {
    const { classCourseId, date } = useParams();
    const [course, setCourse] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const fetchClass = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get(`/class/${classCourseId}`);
            if(response.data.success){
                setCourse(response.data.class.course);
                setInstructor(response.data.class.instructor.user);
            } else {
                throw new Error("Failed to load class");
            }
        } catch (error) {
            console.error("Error fetching class:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClass();
    }, [classCourseId]);

    const [activeTab, setActiveTab] = useState("students");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    if (error) return <ErrorRoute code={error} />;

    if (loading) return (
        <div className="flex flex-col w-full gap-4 items-end">
            <Header />
            <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs p-6 rounded-xl scrollbar-none">
            </div>
        </div>
    );

    return (

            <div className="flex flex-col w-full gap-4 items-end">
                <Header course={course} instructor={instructor} role={role} activeTab={activeTab} handleTabChange={handleTabChange}>
                    {((role === 'Administrator' || role === 'Instructor') && activeTab == 'students') && (
                        <PrimaryButton><AddRoundedIcon/><span className="text-base text-nowrap">Enroll Student</span></PrimaryButton>
                    )}
                    {(activeTab == 'attendance') && (<PrimaryButton><span className="text-base text-nowrap">View Class Sessions</span></PrimaryButton>)}
                    {((role === 'Administrator' || role === 'Instructor') && activeTab == 'tasks') && (<PrimaryButton><AddRoundedIcon/><span className="text-base text-nowrap">Task</span></PrimaryButton>)}
                    {((role === 'Administrator' || role === 'Instructor') && activeTab == 'announcements') && (<PrimaryButton><AddRoundedIcon/><span className="text-base text-nowrap">Announcement</span></PrimaryButton>)}
                </Header>
                {
                    activeTab === "students" ? (
                        <IndexTab classCourseId={classCourseId} role={role} />
                    ) : activeTab === "attendance" ? (
                        <AttendanceTab role={role} date={date || ''}/>
                    ) : activeTab === "tasks" ? (
                        <TaskTab role={role} />
                    ) : activeTab === "announcements" ? (
                        <AnnouncementTab role={role}/>
                    ) : null
                }
            </div>

    );
}