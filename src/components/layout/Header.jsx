import { Bell, ChevronLeft, User } from "lucide-react";
import { useLocation, Link} from "react-router-dom";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const breadcrumbs = location.pathname.split("/").filter(Boolean);

  return (
    <header className="flex items-center gap-10 px-6 py-4 bg-white">
      <Button>
        <ChevronLeft />
      </Button>
        <div className="flex w-full"/>
      <div className="flex items-center gap-4">
        <Link to={"/notifications"}>
          <Bell />
        </Link>
      </div>
        <Link to={"/profile"}>
          <div className="w-fit text-gray-700">{user?.first_name || "User"}!</div>        
        </Link>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={logout}>
          Logout
        </button>
    </header>
  );
}
