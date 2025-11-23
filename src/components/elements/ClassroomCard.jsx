import { Link } from "react-router-dom";

export default function ClassroomCard({ classroomId, programName, yearLevel, section, color }) {
    return (
        <Link className="flex flex-col h-60 rounded-xl overflow-hidden" to={`/courses/${classroomId}`}>
            <div className="flex items-center justify-end h-13/21 p-6" style={{ backgroundColor: `#${color}` }}>
                <h1 className="font-bold text-8xl text-zinc-50">{yearLevel}{section}</h1>
            </div>
            <div className="flex flex-col bg-white h-8/21 pt-4 pb-6 px-4">
                <h2 className="font-semibold text-xl">{programName} {yearLevel}{section}</h2>
            </div>
        </Link>
    );
}