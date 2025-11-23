import Sidebar from "./Sidebar";
import { useLocation, Link, Outlet} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationPanel from "../elements/Notification";
import { useState } from "react";


export function Copyright() {
  return (
    <span className="pt-4 text-gray-500 font-light text-sm">&copy; All rights reserved <a href="https://github.com/Ry-leigh" target="_blank" className="text-violet-400">Mythrynne</a></span>
  )
}

export default function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-white mr-4">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between gap-10 pr-6 pl-2 py-4 bg-white text-nowrap">
          <div className="flex gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center justify-center rounded-lg p-2 text-xl bg-violet-50 text-violet-700 hover:bg-violet-700 hover:text-white transition">
              <MenuRoundedIcon fontSize="inherit"/>
            </button>
            {/* replace with breadcrubs once availble */}
            <div className="flex items-center text-gray-500 hover:text-violet-400">Insert&nbsp;&nbsp;{'>'}&nbsp;&nbsp;Breadcrumbs&nbsp;&nbsp;{'>'}&nbsp;&nbsp;<p className="text-violet-700">Here</p></div>
          </div>

          <div className="flex items-center gap-8">
            <NotificationPanel/>
            <Link to={"/profile"}>
              <div className="w-fit text-gray-700">{user?.first_name || "User"}</div>        
            </Link>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="flex h-full p-6 overflow-y-auto bg-indigo-50 rounded-2xl scrollbar-none">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
