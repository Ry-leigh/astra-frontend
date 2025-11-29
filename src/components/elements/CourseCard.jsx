import { useState, useRef, useEffect } from "react";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Link } from "react-router-dom";

export default function CourseCard({ classCourseId, courseName, courseInstructor, semesterId, color, onEdit, onDelete }) {
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <Link className="flex flex-col h-60 rounded-xl overflow-hidden shadow-sm transition-all hover:scale-99 cursor-pointer" to={`/class/${classCourseId}`}>
                <div className="flex content-center h-13/21 p-4 justify-end" style={{ backgroundColor: `${color}` }} />
                <div className="flex w-full justify-between bg-white h-8/21 pt-4 pb-6 px-4">
                    <div className="flex flex-col w-9/10">
                        <h2 className="font-semibold text-lg truncate">{courseName}</h2>
                        <p className="text-sm">{courseInstructor}</p>
                        <p className="hidden">{semesterId}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenMenu(!openMenu);
                        }}
                        className="flex text-gray-600 hover:text-black cursor-pointer"
                    >
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </Link>

            {openMenu && (
                <div ref={menuRef}
                    className="absolute right-4 top-16 w-1/3 bg-white border border-gray-300 rounded-sm shadow-md z-50 truncate">
                    <button
                        onClick={() => onEdit({  })}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    >
                        <EditRoundedIcon fontSize="small" /> Edit
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); onDelete({ id: classCourseId, name: `${courseName}` })}}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50"
                    >
                        <DeleteOutlineRoundedIcon fontSize="small" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}