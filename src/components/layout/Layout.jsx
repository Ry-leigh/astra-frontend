import Sidebar from "./Sidebar";
import { useLocation, Link, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationPanel from "../elements/Notification";
import { useEffect, useRef, useState } from "react";

import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export function Copyright() {
  return (
    <span className="pt-4 text-gray-500 font-light text-sm">&copy; All rights reserved <a href="https://github.com/Ry-leigh" target="_blank" className="text-violet-400">Mythrynne</a></span>
  )
}

function HeaderDropdown({
  label = "Select",
  value,
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || label;

  return (
    <div className="relative h-full w-full" ref={wrapperRef}>
      {/* Display Box */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={`h-full w-fit rounded-lg px-4 py-3 cursor-pointer bg-violet-50
          text-gray-800 select-none flex justify-between items-center gap-2
          transition-all duration-150
          hover:bg-violet-100
          ${open ? "bg-violet-100" : ""}
        `}
      >
        <span className={`${value ? "" : "text-gray-400"}`}>
          {selectedLabel}
        </span>

        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-20 max-h-60 overflow-auto 
                     animate-slide-down"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-colors
                hover:bg-gray-100 
                ${
                  opt.value === 2
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-800"
                }
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-white mr-4">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between gap-10 pr-6 pl-2 py-4 bg-white text-nowrap">
          <div className="flex gap-4">
            {/* <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center justify-center rounded-lg p-2 text-xl bg-violet-50 text-violet-700 hover:bg-violet-700 hover:text-white transition">
              <MenuRoundedIcon fontSize="inherit"/>
            </button> */}
            
            {/* replace with breadcrubs once availble */}
            <div className="flex items-center text-gray-500 hover:text-violet-400">Insert&nbsp;&nbsp;{'>'}&nbsp;&nbsp;Breadcrumbs&nbsp;&nbsp;{'>'}&nbsp;&nbsp;<p className="text-violet-700">Here</p></div>
          </div>

          <div className="flex items-center gap-8">
            <NotificationPanel/>
            <div className="flex w-fit">
              <HeaderDropdown
              label={`${user.first_name || "User"}`}
              value={user?.first_name || "User"}
              onChange={(e) => {if (e == 1) {navigate("/profile")} else if (e == 2) {logout()}}}
              options={[{ value: 1, label: (<div className="flex gap-2 items-center"><PersonRoundedIcon fontSize="inherit"/>Profile</div>) }, { value: 2, label: (<div className="flex gap-2 items-center"><LogoutRoundedIcon fontSize="inherit"/>Logout</div>) }]}
            />
            </div>
          </div>
        </header>
        <main className="flex h-full p-6 overflow-y-auto bg-indigo-50 rounded-2xl scrollbar-none">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
