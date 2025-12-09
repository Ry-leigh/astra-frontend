import { useState, useEffect } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import logo from "@/assets/logo.png"

export default function Sidebar({ collapsed=false }) {
  const { user, loading } = useAuth();

  const menus = {
    Administrator:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" /> },
        { name: "Announcements", path: "/announcements", icon: <CampaignOutlinedIcon fontSize="small" /> },
        { name: "Calendar", path: "/calendar", icon: <CalendarTodayOutlinedIcon fontSize="small" /> },
        { name: "Programs", path: "/programs", icon: <BusinessOutlinedIcon fontSize="small" /> },
        { name: "Classes", path: "/classes", icon: <LibraryBooksOutlinedIcon fontSize="small" /> },
        { name: "Users", path: "/users", icon: <GroupsOutlinedIcon fontSize="small" /> },
        // { name: "Courses", path: "/course", icon: <SchoolOutlinedIcon fontSize="small" /> }
      ],
      bottom: [
        { name: "Help", path: "/help", icon: <InfoOutlinedIcon fontSize="small" /> },
        // { name: "Settings", path: "/settings", icon: <SettingsOutlinedIcon fontSize="small" /> }
      ]
    },
    Instructor:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" /> },
        { name: "Calendar", path: "/calendar", icon: <CalendarTodayOutlinedIcon fontSize="small" /> },
        { name: "Announcements", path: "/announcements", icon: <CampaignOutlinedIcon fontSize="small" /> },
        { name: "Classes", path: "/classes", icon: <LibraryBooksOutlinedIcon fontSize="small" /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <InfoOutlinedIcon fontSize="small" /> },
        // { name: "Settings", path: "/settings", icon: <SettingsOutlinedIcon fontSize="small" /> }
      ]
    },
    Officer:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" /> },
        { name: "Calendar", path: "/calendar", icon: <CalendarTodayOutlinedIcon fontSize="small" /> },
        { name: "Announcements", path: "/announcements", icon: <CampaignOutlinedIcon fontSize="small" /> },
        { name: "Courses", path: "/classes", icon: <SchoolOutlinedIcon fontSize="small" /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <InfoOutlinedIcon fontSize="small" /> },
        // { name: "Settings", path: "/settings", icon: <SettingsOutlinedIcon fontSize="small" /> }
      ]
    },
    Student:
    { top: [
        { name: "Dashboard", path: "/dashboard", icon: <SpaceDashboardOutlinedIcon fontSize="small" /> },
        { name: "Calendar", path: "/calendar", icon: <CalendarTodayOutlinedIcon fontSize="small" /> },
        { name: "Announcements", path: "/announcements", icon: <CampaignOutlinedIcon fontSize="small" /> },
        { name: "Courses", path: "/classes", icon: <SchoolOutlinedIcon fontSize="small" /> }],
      bottom: [
        { name: "Help", path: "/help", icon: <InfoOutlinedIcon fontSize="small" /> },
        // { name: "Settings", path: "/settings", icon: <SettingsOutlinedIcon fontSize="small" /> }
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
    <aside className={`bg-white h-screen ${collapsed ? 'w-21.5' : 'w-3xs'} transition-all duration-300 flex flex-col px-4 pb-8`}>
      <div className="flex items-center px-2 py-5">
        <Link className="flex items-center w-fit h-8 gap-4" to={"/"}>
          <img src={logo} alt="A" className="w-9"/>
          {!collapsed && <div className="font-bold text-xl">ASTRA</div>}
        </Link>
      </div>

      <nav className="flex flex-col gap-1.5 h-full text-gray-700 text-sm">
        {userMenus.top.map((menu, i) => (
          <NavLink to={menu.path} key={i} className={
            ({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-violet-100 hover:text-violet-800 transition-all duration-150 ${
                isActive ? "bg-violet-100 text-violet-800 font-medium" : ""}`}>
            {menu.icon}
            {!collapsed && <span>{menu.name}</span>}
          </NavLink>
        ))}
        <div className="h-full" />
        {userMenus.bottom.map((menu, i) => (
          <NavLink to={menu.path} key={i} className={
            ({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-violet-100 hover:text-violet-800 transition-all duration-150 ${
                isActive ? "bg-violet-100 text-violet-800 font-medium" : ""}`}>
            {menu.icon}
            {!collapsed && <span>{menu.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
