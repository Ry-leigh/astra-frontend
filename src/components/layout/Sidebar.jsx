import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Settings, Calendar, LayoutDashboard, Megaphone, Shapes, Presentation, User, MessageCircleQuestionMark, LibraryBig } from "lucide-react";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();

  const menus = {
    Administrator:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
        { name: "Announcements", path: "/announcements", icon: <Megaphone size={18} /> },
        { name: "Programs", path: "/programs", icon: <Shapes size={18} /> },
        { name: "Users", path: "/users", icon: <Users size={18} /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <MessageCircleQuestionMark size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
      ]
    },
    Instructor:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
        { name: "Announcements", path: "/announcements", icon: <Megaphone size={18} /> },
        { name: "Classes", path: "/classes", icon: <Presentation size={18} /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <MessageCircleQuestionMark size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
      ]
    },
    Officer:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
        { name: "Announcements", path: "/announcements", icon: <Megaphone size={18} /> },
        { name: "Courses", path: "/classes", icon: <LibraryBig size={18} /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <MessageCircleQuestionMark size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
      ]
    },
    Student:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
        { name: "Announcements", path: "/announcements", icon: <Megaphone size={18} /> },
        { name: "Courses", path: "/classes", icon: <LibraryBig size={18} /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <MessageCircleQuestionMark size={18} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> }
      ]
    }
  };

  if (loading || !user.roles?.length) {
    return (
      <aside className="w-64 h-screen bg-blue-950 border-r flex items-center justify-center">
        <div className="text-gray-500">Loading menu...</div>
      </aside>
    );
  }

  const userMenus = menus[user.roles[0].name] || menus["student"];
  return (
    <aside className="bg-blue-950 h-screen w-1/6 transition-all duration-300 flex flex-col border-r text-zinc-50">
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-xl">Astra</span>
      </div>

      <nav className="flex flex-col gap-1 px-2 mt-4 mb-8 h-full text-zinc-400 font-medium">
        {userMenus.top.map((menu, i) => (
          <NavLink
            key={i}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900 hover:text-zinc-50 ${
                isActive ? "bg-blue-200 text-blue-900" : ""
              }`
            }
          >
            {menu.icon}
            {!collapsed && <span>{menu.name}</span>}
          </NavLink>
        ))}
        <div className="h-full" />
        {userMenus.bottom.map((menu, i) => (
          <NavLink
            key={i}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900 hover:text-zinc-50 ${
                isActive ? "bg-blue-200 text-blue-900" : ""
              }`
            }
          >
            {menu.icon}
            {!collapsed && <span>{menu.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
