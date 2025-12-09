import api from "../api/axios"
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import ErrorRoute from "@/router/ErrorRoute";
import ClassPreloader from "@/components/preloaders/ClassPreloader";
import { PrimaryButton, EditButton } from "@/components/elements/Buttons";
import { ClassIndex, ClassAttendance, ClassTask, ClassAnnouncement } from "@/components/elements/ClassContents";
import Modal from "@/components/elements/Modal";
import EnrollStudentForm from "@/components/forms/EnrollStudentForm";
import CreateClassTaskForm from "@/components/forms/CreateClassTaskForm";
import Preloader from "@/components/preloaders/Preloader";

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
                    </div>
                    <div className="flex items-center gap-2">
                        <p>{instructor.sex == 'M' ? 'Mr. ' : (instructor.sex == 'F' ? 'Ms. ' : '')} {instructor.first_name} {instructor.last_name}</p>
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

function IndexTab({ classCourseId, role, reloadKey }) { return <ClassIndex classCourseId={classCourseId} role={role} reloadKey={reloadKey}/> }
function AttendanceTab({ role = '', date = '' }) { return <ClassAttendance role={role} date={date} /> }
function TaskTab({ role = '', reloadKey }) { return <ClassTask role={role} reloadKey={reloadKey}/> }
function AnnouncementTab({ role = '' }) { return <ClassAnnouncement role={role}/> }

export default function ClassPage() {
    const { classCourseId, date } = useParams();
    const [course, setCourse] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [reloadStudentsKey, setReloadStudentsKey] = useState(0);

    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [reloadTasksKey, setReloadTasksKey] = useState(0);

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
            setError(error?.response?.status || 500);
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
            <Preloader text="Loading class"/>
        </div>
    );

    return (
        <div className="flex flex-col w-full gap-4 items-end">
            <Header course={course} instructor={instructor} role={role} activeTab={activeTab} handleTabChange={handleTabChange}>
                {((role === 'Administrator' || role === 'Instructor') && activeTab == 'students') && (
                    <button onClick={() => {setEnrollModalOpen(true)}} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-sm font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20">
                        <AddRoundedIcon/><span className="text-base text-nowrap">Enroll Student</span>
                    </button>
                )}
                {(activeTab == 'attendance') && (
                    <button className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-sm font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20">
                        <span className="text-base text-nowrap">View Class Sessions</span>
                    </button>
                )}
                {((role === 'Administrator' || role === 'Instructor') && activeTab == 'tasks') && (
                    <button onClick={() => {setCreateTaskModalOpen(true)}} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-sm font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20">
                        <AddRoundedIcon/><span className="text-base text-nowrap">Task</span>
                    </button>
                )}
                {((role === 'Administrator' || role === 'Instructor') && activeTab == 'announcements') && (
                    <button className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-sm font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20">
                        <AddRoundedIcon/><span className="text-base text-nowrap">Announcement</span>
                    </button>
                )}
            </Header>
            {
                activeTab === "students" ? (
                    <IndexTab classCourseId={classCourseId} role={role} reloadKey={reloadStudentsKey}/>
                ) : activeTab === "attendance" ? (
                    <AttendanceTab role={role} date={date || ''}/>
                ) : activeTab === "tasks" ? (
                    <TaskTab role={role} reloadKey={reloadTasksKey} />
                ) : activeTab === "announcements" ? (
                    <AnnouncementTab role={role}/>
                ) : null
            }
            <Modal open={enrollModalOpen} onClose={() => {setEnrollModalOpen(false)}} title={`Enroll Student in ${course.name}`}>
                <EnrollStudentForm 
                    classCourseId={classCourseId}
                    onSuccess={() => setReloadStudentsKey(prev => prev + 1)}
                    onClose={() => setEnrollModalOpen(false)}
                />
            </Modal>
            <Modal open={createTaskModalOpen} onClose={() => {setCreateTaskModalOpen(false)}} title="Add Task"> 
                <CreateClassTaskForm 
                    classCourseId={classCourseId}
                    onSuccess={() => setReloadTasksKey(prev => prev + 1)}
                    onClose={() => setCreateTaskModalOpen(false)}
                />
            </Modal>
        </div>
    );
}