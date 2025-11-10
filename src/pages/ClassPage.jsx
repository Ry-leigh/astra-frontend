import api from "../api/axios"
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import { useParams } from "react-router-dom";
import ClassPreloader from "@/components/preloaders/ClassPreloader";
import { Link } from "react-router-dom";
import ClassNavigation from "@/components/elements/ClassNavigation";
import { useAuth } from "@/context/AuthContext";

export default function ClassPage() {
    const { id } = useParams();
    const [course, setCourse] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollees, setEnrollees] =useState([]);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const fetchClass = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get(`/class/${id}`);
            console.log(response.data);
            if(response.data.success){
                setCourse(response.data.class.course);
                setInstructor(response.data.class.instructor.user);
                setEnrollees(response.data.class.enrollments)
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
    }, [id]);

    if (loading) return (
        <Layout>
            <ClassPreloader />
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
                        <h3 className="text-white font-medium">Add Student</h3>
                    </button>
                )}

                <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl">
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
                                            <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-gray-800 hover:bg-gray-200 transition" onClick={() => console.log("Edit", enrollee.student.user.id)}>
                                                Edit
                                            </button>
                                            <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-red-600 hover:bg-red-100 transition" onClick={() => console.log("Delete", enrollee.student.user.id)}>
                                                Delete
                                            </button>
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
            </div>
        </Layout>
    );
}