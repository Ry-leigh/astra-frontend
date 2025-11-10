import { Link } from "react-router-dom";

export default function ProgramCard({ programId, programName, programDesc, color }) {
    return (
        <Link className="flex flex-col h-60 rounded-xl overflow-hidden" to={`/classrooms/${programId}`}>
            <div className="flex content-center h-13/21 p-4 justify-end" style={{ backgroundColor: `#${color}` }}>
                <div className="h-19/20 bg-white aspect-square rounded-full " />
            </div>
            <div className="flex flex-col bg-white h-8/21 pt-4 pb-6 px-4">
                <h2 className="font-semibold text-lg">{programName}</h2>
                <p className="max-h-6 overflow-y-auto text-sm scrollbar-none">{programDesc}</p>
            </div>
        </Link>
    );
}