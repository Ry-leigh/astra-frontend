import { useEffect, useState } from "react";
import api from "@/api/axios";
import dayjs from "dayjs";
import { X, Calendar, Clock, Globe, User, Users, AlignLeft, Pencil, Trash } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import Modal from "../elements/Modal";
import EditCalendarEventForm from "../forms/EditCalendarEventForm";

const formatDate = dateStr => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

// Helper to format time
const formatTime = timeStr => {
    if (!timeStr) return ""
    const [hours, minutes] = timeStr.split(":")
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}

export default function ViewEventModal({ event, onSuccess, onClose, onEdit, onDelete }) {
    const [categoryBg, setCategoryBg] = useState("");
    const [category, setCategory] = useState("");
    const { user } = useAuth();
    const [openEditModal, setOpenEditModal] = useState(false)
    const [opneDeleteModal, setOpenDeleteModal] = useState(false)

    useEffect(() => {
        if (!event) return;

        switch (event.category) {
            case "holiday":
                setCategoryBg("bg-green-500");
                setCategory("Holiday");
                break;
            case "event":
                setCategoryBg("bg-blue-500");
                setCategory("Event");
                break;
            case "meeting":
                setCategoryBg("bg-violet-500");
                setCategory("Meeting");
                break;
            case "makeup_class":
                setCategoryBg("bg-orange-500");
                setCategory("Make-up Class");
                break;
            default:
                setCategoryBg("bg-gray-500");
                setCategory("Unknown");
        }
    }, [event]); // re-run when event changes

    return (
        <div className="flex flex-col w-fit -mt-4 gap-2">

            <div className="flex flex-col min-w-lg w-fit overflow-y-auto p-4">
                {/* Title Section */}
                <div className="flex flex-col mb-6">
                    <div className="flex items-center mb-2">
                        <span className={`text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${categoryBg}`}>
                            {category}
                        </span>
                        {event.repeats !== "none" && (
                            <span className="ml-2 text-xs font-medium text-gray-500 border border-gray-300 px-2 py-0.5 rounded bg-gray-50 capitalize">
                                Repeats: {event.repeats}
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                        {event.title}
                    </h3>
                </div>

                <hr className="border-gray-200 mb-6" />

                {/* Details List */}
                <div className="flex flex-col space-y-4">
                    {/* Date */}
                    <div className="flex items-start">
                        <div className="w-8 mt-0.5">
                            <Calendar className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                                Date
                            </p>
                            <p className="text-gray-900 font-medium text-base">
                                {formatDate(event.start)}
                                {event.start !== event.end && (
                                    <span className="text-gray-500 font-normal mx-1"> to </span>
                                )}
                                {event.start !== event.end && formatDate(event.end)}
                            </p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start">
                        <div className="w-8 mt-0.5">
                            <Clock className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                                Time
                            </p>
                            <div className="text-gray-900 font-medium text-base">
                                {event.allDay ? (
                                    <span className="inline-block bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-sm">
                                        All Day Event
                                    </span>
                                ) : (
                                    <>
                                        {formatTime(event.timeStart)}
                                        {event.timeEnd && (
                                            <span className="mx-1 text-gray-400">-</span>
                                        )}
                                        {formatTime(event.timeEnd)}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex w-full items-start">
                        <div className="w-8 mt-0.5">
                            <AlignLeft className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex flex-col w-full">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Description
                            </p>
                            <div className="flex w-full text-gray-800 leading-relaxed text-sm bg-gray-50 border border-gray-200 rounded p-3">
                                {event.description || (
                                    <span className="text-gray-400 italic">
                                        No description provided.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Participants / Targets */}
                    {event.targets && event.targets.length > 0 && (
                        <div className="flex items-start pt-2">
                            <div className="w-8 mt-0.5">
                                <Users className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Visible to
                                </p>
                                <ul className="space-y-2">
                                    {event.targets.map(target => (
                                        <li
                                            key={target.id}
                                            className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded text-sm"
                                        >
                                            <div className="flex items-center text-gray-700">
                                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                                <span className="capitalize font-medium">
                                                    {target.target_type == "global" ? "Everyone" : target.target_type}
                                                </span>
                                            </div>
                                            {target.target_id && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    ID: {target.target_id}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {user.roles[0].name == "Administrator" && (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onEdit}
                        className="gap-2 text-sm inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-200 transition"
                    >
                        Edit Event <Pencil className="h-4 w-4" />
                    </button>

                    <button
                        onClick={onDelete}
                        className="gap-2 text-sm inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-100 transition"
                    >
                        Delete Event <Trash className="h-4 w-4" />
                    </button>

                </div>
            )}
        </div>
    );
}