import api from "../api/axios"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import ClassAnnouncementPreloader from "@/components/preloaders/ClassAnnouncementPreloader";
import ErrorRoute from "@/router/ErrorRoute";
import Layout from "@/components/layout/Layout";
import ClassNavigation from "@/components/elements/ClassNavigation";

export default function ClassAnnouncementPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [course, setCourse] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const fetchAnnouncements = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get(`/class/${id}/announcements`);
            console.log(response.data);
            if(response.data.success){
                setCourse(response.data.class.course)
                setInstructor(response.data.class.instructor.user);
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
    },[id])

    if (loading) return (
        <Layout>
            <ClassAnnouncementPreloader />
        </Layout>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <Layout>
            <div className="flex flex-col w-full gap-4 items-end">
                <div className="flex flex-col bg-zinc-50 w-full shadow-xs pt-6 px-6 rounded-xl">
                    <div className="flex pb-3 gap-1">
                        <h1 className="flex font-semibold text-2xl">{course.name}</h1>
                        {(role === 'Administrator') && (
                            <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-gray-800 hover:bg-gray-200 transition" onClick={() => console.log("Edit", enrollee.student.user.id)}>
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <p>{instructor.sex == 'M' ? 'Mr. ' : 'Ms. '} {instructor.first_name} {instructor.last_name}</p>
                        {(role === 'Administrator') && (
                            <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-gray-800 hover:bg-gray-200 transition" onClick={() => console.log("Edit", enrollee.student.user.id)}>
                                Edit
                            </button>
                        )}
                    </div>
                    <ClassNavigation course={course} />
                </div>
                {(role === 'Administrator' || role === 'Instructor') && (
                    <button className="flex w-fit bg-blue-950 rounded-lg items-center p-3 gap-2">
                        +
                        <h3 className="text-white font-medium">Add Announcement</h3>
                    </button>
                )}
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
            </div>
        </Layout>
    )
}