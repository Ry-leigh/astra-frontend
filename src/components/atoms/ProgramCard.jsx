import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgramCard({ programId, programName, programDesc, color }) {
    return (
        <Link className="flex flex-col h-auto w-1/3 drop-shadow-xs" to={`/classrooms/${programId}`}>
            <div className="flex content-center h-36 p-4 rounded-t-xl" style={{ backgroundColor: `#${color}` }}>
                <EllipsisVertical color="white" size={32} />
                <div className="w-full" />
                <div className="h-19/20 bg-zinc-50 aspect-square rounded-full " />
            </div>
            <div className="flex flex-col bg-zinc-50 pt-4 pb-6 px-4 rounded-b-xl">
                <h2 className="font-semibold text-xl">{programName}</h2>
                <p className="max-h-5 overflow-y-auto pr-1 font-normal text-sm">{programDesc}</p>
            </div>
        </Link>
    );
}