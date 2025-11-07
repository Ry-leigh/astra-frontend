import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClassroomCard({ classroomId, programName, yearLevel, section, color }) {
    return (
        <Link className="flex flex-col h-auto w-1/3 drop-shadow-xs" to={`/courses/${classroomId}`}>
            <div className="flex h-36 p-4 rounded-t-xl" style={{ backgroundColor: `#${color}` }}>
                <EllipsisVertical color="white" size={32} />
                <div className="w-full" />
                <h1 className="font-bold text-8xl text-zinc-50">{yearLevel}{section}</h1>
            </div>
            <div className="flex flex-col bg-zinc-50 pt-4 pb-5   px-4 rounded-b-xl">
                <h2 className="font-semibold text-xl">{programName} {yearLevel}{section}</h2>
            </div>
        </Link>
    );
}