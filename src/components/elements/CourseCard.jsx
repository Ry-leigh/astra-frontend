import { Link } from "react-router-dom";

export default function CourseCard({ classCourseId, courseName, courseInstructor, semester, color }) {
    return (
        <Link className="flex flex-col h-60 rounded-xl overflow-hidden" to={`/class/${classCourseId}`}>
            <div className="flex content-center h-13/21 p-4 justify-end" style={{ backgroundColor: `#${color}` }} />
            <div className="flex flex-col bg-white h-8/21 pt-4 pb-6 px-4">
                <h2 className="font-semibold text-lg truncate">{courseName}</h2>
                <p className="text-sm">{courseInstructor}</p>
                <p className="hidden">{semester}</p>
            </div>

        </Link>
    );
}