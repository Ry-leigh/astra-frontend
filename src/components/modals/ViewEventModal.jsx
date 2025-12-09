import { useEffect, useState } from "react";
import api from "@/api/axios";
import dayjs from "dayjs"

export default function ViewEventModal({ event, onSuccess, onClose }) {
    console.log(event)
    return (
        <div>
            {event.description ? (
                <p>
                    {event.description}
                </p>
            ) : (
                <p className="text-gray-400 italic text-sm">
                    'No Description'
                </p>
            )}
            
            
        </div>
    )
}