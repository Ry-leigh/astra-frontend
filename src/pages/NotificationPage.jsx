import api from "../api/axios"
import { useEffect, useState } from "react";

import PageHeader from "@/components/elements/PageHeader";
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Preloader from "@/components/preloaders/Preloader";
dayjs.extend(relativeTime);

export function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [notificationId, setNotificationId] = useState()

    const handleDeleteNotification = async (id) => {
        setLoading(true);
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            if (response.data.success) {
                console.log("Notification deleted", response.data);
                setEnrolleeList(prev => prev.filter(e => e.id !== id));
            } else {
                throw new Error("Failed to unenroll student");
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
        const response = await api.get("/notifications");
        if (response.data.success) {
            console.log(response.data.notifications);
            setNotifications(response.data.notifications);
        }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) return (
    <Preloader text="Loading notifications"/>
    )

    return (
        <div className="flex flex-col bg-white p-4 gap-4">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="flex border justify-between items-center border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">{notification.data.title}</p>
                            <p className="text-sm text-wrap">{notification.data.message}</p>
                            <p className="text-sm text-gray-400">{dayjs(notification.created_at).fromNow()}</p>
                        </div>
                        <button className="h-fit items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-100 transition" onClick={() => handleDeleteNotification()}>
                            <IndeterminateCheckBoxOutlinedIcon />
                        </button>
                    </div>
                ))
            ) : (
                <div>
                    You have no notifications
                </div>
            )}
        </div>
    )
}

export default function NotificationPage() {
    return(
        <>
            <div className="flex flex-col h-full w-full gap-6">
                <PageHeader title="Notifications"/>
                <div className="flex flex-col h-full overflow-y-auto bg-white w-full rounded-xl">
                    <NotificationList/>
                </div>
            </div>
        </>
    );
}