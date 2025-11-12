import { useLocation, Link} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationPanel from "../elements/Notification";

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center gap-10 px-6 py-4 bg-white text-nowrap">
      {/* replace with breadcrubs once availble */}
      <div className="flex items-center text-gray-500 hover:text-violet-400">Insert&nbsp;&nbsp;{'>'}&nbsp;&nbsp;Breadcrumbs&nbsp;&nbsp;{'>'}&nbsp;&nbsp;<p className="text-violet-700">Here</p></div>

      <div className="flex w-full"/>

      <div className="flex items-center gap-4">
        <NotificationPanel/>
        {/* <Link to={"/notifications"}>
          <NotificationsNoneOutlinedIcon />
        </Link> */}
      </div>

      {/* replace with profile dropdown once available & remove logout button*/}
      <Link to={"/profile"}>
      <div className="w-fit text-gray-700">{user?.first_name || "User"}</div>        
      </Link>
      <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
