import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseCard({ classCourseId, courseName, courseInstructor, semester }) {
    return (
        <Link className="flex flex-col h-55 w-1/3" to={`/class/${classCourseId}`}>
            <div className="flex bg-red-400 h-2/3 p-4 rounded-t-xl">
                <EllipsisVertical color="white" size={32} />
            </div>
            <div className="flex flex-col p-4 rounded-b-xl">
                <h2 className="font-semibold text-xl">{courseName}</h2>
                <p className="max-h-5 overflow-y-auto pr-1 font-normal text-sm">{courseInstructor}</p>
                <p className="hidden">{semester}</p>
            </div>

        </Link>
    );
}