import api from "@/api/axios"
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function NotificationPanel() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const panelRef = useRef(null); // 👈 Reference to the panel container

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            const response = await api.patch("/notifications/mark-all-read");
            console.log(response.data);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {function handleClickOutside(event) {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            setOpen(false);
        }
    }

    if (open) {
        document.addEventListener("mousedown", handleClickOutside);
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    }}, [open]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="relative" ref={panelRef}>
        <button onClick={async () => {
                const nextOpen = !open;
                setOpen(nextOpen);
                if (nextOpen) await markAllRead();
            }} className="relative">
            <NotificationsNoneOutlinedIcon className="text-gray-600 w-6 h-6" />
            {notifications.some(n => !n.read_at) && (
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50">
            <div className="p-3 font-semibold border-b border-gray-200 flex justify-between items-center">
                Notifications
                <Link to={"/notifications"}
                onClick={markAllRead}
                className="text-xs text-blue-500 hover:underline"
                >
                View all
                </Link>
            </div>

            <ul className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <li
                    key={notification.id}
                    className={`p-3 hover:bg-gray-100 cursor-pointer ${!notification.read_at ? 'bg-gray-50' : ''
                        }`}
                    >
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-500">
                        {notification.data?.message || 'New update available'}
                    </p>
                    <p className="text-xs text-gray-400">
                        {dayjs(notification.created_at).fromNow()}
                    </p>
                    </li>
                ))
                ) : (
                <li className="p-3 text-gray-500 text-sm text-center">
                    No notifications yet.
                </li>
                )}
            </ul>
            </div>
        )}
        </div>
    );
    }
