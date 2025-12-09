import api from "../api/axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

import PageHeader from "@/components/elements/PageHeader";
import ErrorRoute from "@/router/ErrorRoute";
import Preloader from "@/components/preloaders/Preloader";

export default function UsersPage() {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            console.log(response.data);
            if (response.data.success) {
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
        <Preloader text="Loading users"/>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <>
            <div className="flex flex-col w-full gap-4">
                <PageHeader title="Users" />

                <div className="flex flex-col h-full bg-white w-full shadow-xs p-2 rounded-xl">
                    <div className="flex justify-between m-4 mb-3 items-center">
                        <div className="flex items-center border border-gray-300 w-xs py-2 px-4 rounded-full gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name..."
                                className="outline-none bg-transparent w-full text-gray-700"
                            />
                            <SearchRoundedIcon className="text-gray-600" />
                        </div>
                        <Link className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-base font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20" to={"/users/create"}>
                            <PersonAddRoundedIcon /> Create User
                        </Link>
                    </div>

                    <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs pb-4 px-6 rounded-xl gap-3 scrollbar-none">
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
                                    users
                                        .filter((user) => {
                                            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                                            return fullName.includes(search.toLowerCase());
                                        })
                                        .map((user) => (
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
                                                <td className="px-4 py-3 text-center">
                                                    <Link to={`/users/${user.id}`} className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 text-xl hover:bg-gray-200 transition">
                                                        <EditRoundedIcon fontSize="inherit" />
                                                    </Link>
                                                    <button className="inline-flex items-center justify-center rounded-md p-2 text-red-600 text-xl hover:bg-red-100 transition">
                                                        <IndeterminateCheckBoxOutlinedIcon fontSize="inherit" />
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
            </div>
        </>
    );
}