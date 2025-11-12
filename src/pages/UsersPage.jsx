import api from "../api/axios"
import { useEffect, useState } from "react";

import UserPreloader from "@/components/preloaders/UserPreloader";
import ErrorRoute from "@/router/ErrorRoute";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";

export default function UsersPage() {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            console.log(response.data);
            if(response.data.success){
                setUsers(response.data.users)
            } else {
                throw new Error("Failed to load users");
            }
        } catch (error) {
            console.error("Error fetching class:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    if (loading) return (
        <Layout>
            <UserPreloader />
        </Layout>
    );

    if (error) return <ErrorRoute code={error} />;

    return(
        <Layout>
            <div className="flex flex-col w-full gap-4">
                <PageHeader>Users</PageHeader>

                <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="sticky top-0 bg-white">
                            <tr className="">
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Role</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Sex</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Address</th>
                                <th className="px-4 py-3 pt-6 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {users.length > 0 ? (
                                users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-4 py-3 text-gray-900">
                                        {user.last_name}, {user.first_name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{user.email}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {user.roles.map((role) => `${role.name}`).join(", ")}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{user.sex == 'M' ? 'Male' : 'Female'}</td>
                                    <td className="px-4 py-3 text-gray-700">{user.address}</td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-gray-800 hover:bg-gray-200 transition" onClick={() => console.log("Edit", enrollee.student.user.id)}>
                                            Edit
                                        </button>
                                        <button className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-red-600 hover:bg-red-100 transition" onClick={() => console.log("Delete", enrollee.student.user.id)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                                        No Users found.
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