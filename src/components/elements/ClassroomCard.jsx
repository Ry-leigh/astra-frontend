import { useState, useRef, useEffect } from "react";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Link } from "react-router-dom";

export default function ClassroomCard({ classroomId, programName, yearLevel, section, academicYearId, color, onEdit, onDelete }) {
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
            <Link className="flex flex-col h-60 rounded-xl overflow-hidden shadow-sm transition-all hover:scale-99 cursor-pointer" to={`/courses/${classroomId}`}>
                <div className="flex items-center h-13/21 p-6" style={{ backgroundColor: `#${color}` }}>
                    <h1 className="font-bold text-8xl text-zinc-50">{yearLevel}{section}</h1>
                </div>
                <div className="flex bg-white justify-between h-8/21 pt-4 pb-6 px-4">
                    <div className="flex flex-col w-9/10">
                        <h2 className="font-semibold text-xl">{programName} {yearLevel}{section}</h2>
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
                        onClick={() => onEdit({ id: classroomId, yearLevel: yearLevel, section: section, academicYearId: academicYearId })}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    >
                        <EditRoundedIcon fontSize="small" /> Edit
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); onDelete({ id: classroomId, name: `${programName} ${yearLevel}${section}` })}}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50"
                    >
                        <DeleteOutlineRoundedIcon fontSize="small" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}