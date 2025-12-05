import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import { SecondaryButton } from "@/components/elements/Buttons";

import PageHeader from "@/components/elements/PageHeader";
import Calendar from "@/components/elements/Calendar";
import Scheduler from "@/components/elements/Scheduler";

function Navigation({ activeTab, handleTabChange, children }) {
  const neutral = "flex gap-3 items-center p-4 pt-7 px-6";
  const active = "font-medium text-violet-700 border-b-3";
  const inactive = "text-gray-500 border-gray-500/0 border-b-3 hover:text-violet-400";

  return (
    <div className="flex pt-1 pr-1 w-full border-b items-center text-sm border-gray-200 justify-between">
        <div className="flex ">
            <NavLink to="#" end className={`${neutral} ${activeTab === "events" ? active : inactive}`} onClick={() => handleTabChange("events")}>
                <EventNoteOutlinedIcon fontSize="small"/>
                <h2>Events</h2>
            </NavLink>

            <NavLink to="#" end className={`${neutral} ${activeTab === "schedule" ? active : inactive}`} onClick={() => handleTabChange("schedule")}>
                <CalendarMonthOutlinedIcon fontSize="small"/>
                <h2>Schedule</h2>
            </NavLink>
        </div>
        {children}
    </div>
  );
}

export default function CalendarPage() {
  const [role, setRole] = useState();
  const [activeTab, setActiveTab] = useState("events");
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.roles && user.roles[0]) {
      setRole(user.roles[0].name);
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="flex flex-col w-full gap-6">
        <PageHeader title="Calendar"/>
        <div className="flex flex-col w-full h-fit bg-white px-3 content-center rounded-lg text-nowrap">
          <div className="flex flex-col h-full pb-4 px-2">
            <Navigation activeTab={activeTab} handleTabChange={handleTabChange}>{activeTab === "events" ? (role === 'Administrator') && (<SecondaryButton><span className="text-base text-nowrap"><AddRoundedIcon/> Add Event</span></SecondaryButton>) : ''}</Navigation>
            {activeTab === "events" ? <Calendar /> : <Scheduler />}
          </div>
        </div>
      </div>
    </>
  );
}
