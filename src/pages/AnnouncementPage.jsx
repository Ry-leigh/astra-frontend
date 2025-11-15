import api from "../api/axios"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorRoute from "@/router/ErrorRoute";

import dateConverter from "@/components/elements/dateConverter";
import timeConverter from "@/components/elements/timeConverter";

import AnnouncementPreloader from "@/components/preloaders/AnnouncementPreloader";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";
import { EditButton, DeleteButton } from "@/components/elements/Buttons";

export default function AnnouncementPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const fetchAnnouncements = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get("/announcements");
            console.log(response.data)
            if (response.data.success) {
                setAnnouncements(response.data.announcements);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    if (loading) return (
        <Layout>
            <div className="flex flex-col h-full w-full gap-6">
                <PageHeader>Announcements</PageHeader>
                <AnnouncementPreloader />
            </div>
        </Layout>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <Layout>
            <div className="flex flex-col h-full w-full gap-6">
                <PageHeader>Announcements</PageHeader>
                <div className="flex flex-col h-full overflow-y-auto bg-white w-full px-6 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Description</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Time</th>
                                <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">{(role === 'Administrator' || role === 'Instructor')? 'Targets': 'Notified'}</th>
                                {(role === 'Administrator' || role === 'Instructor') && (
                                    <th className="px-4 py-3 pt-6 text-center font-semibold text-gray-700">Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <tr key={announcement.id} className="hover:bg-zinc-50 transition">
                                        <td className="px-4 py-3 text-gray-900">{announcement.title}</td>
                                        <td className="px-4 py-3 text-gray-700">{announcement.description}</td>
                                        <td className="px-4 py-3 text-gray-700">{announcement.event_date? dateConverter(announcement.event_date) : 'TBD'}</td>
                                        <td className="px-4 py-3 text-gray-700">{announcement.event_date? (announcement.event_time? timeConverter(announcement.event_time) : 'All Day') : 'TBD'}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {announcement.targets.map((target) => 
                                                target.target_type === "global"
                                                    ? "Everyone"
                                                    : `${target.target_type}: ${target.target_id}`
                                            ).join(", ")}
                                        </td>
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
                                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
                                        No announcements found.
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