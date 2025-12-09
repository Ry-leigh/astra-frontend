import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "@/api/axios"

import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import { SecondaryButton } from "@/components/elements/Buttons";
import Modal from "@/components/elements/Modal";

import PageHeader from "@/components/elements/PageHeader";
import Calendar from "@/components/elements/Calendar";
import Scheduler from "@/components/elements/Scheduler";
import CreateCalendarEventForm from "@/components/forms/CreateCalendarEventForm";

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { user } = useAuth();

  // Fetch events function moved to CalendarPage
  const fetchEvents = async () => {
    try {
      setRole(user.roles[0].name);
      const response = await api.get("/calendars");
      console.log(response.data);
      if (response.data.success) {
        const mapped = response.data.schedules.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          start: event.start_date,
          end: event.end_date ?? event.start_date,
          allDay: event.all_day === 1,
          timeStart: event.start_time,
          timeEnd: event.end_time,
          repeats: event.repeats,
          category: event.category,
          targets: event.targets,
        }));
        setEvents(mapped);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.roles && user.roles[0]) {
      setRole(user.roles[0].name);
    }
    fetchEvents();  // Fetch events when component mounts
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <PageHeader title="Calendar" />
        <div className="flex flex-col w-full h-fit bg-white px-3 content-center rounded-lg text-nowrap">
          <div className="flex flex-col h-full pb-4 px-2">
            <Navigation activeTab={activeTab} handleTabChange={handleTabChange}>
              {activeTab === "events" && role === "Administrator" && (
                <button
                  onClick={() => setOpenCreateModal(true)}
                  className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-600 text-white text-sm font-medium cursor-pointer hover:bg-violet-700 hover:shadow-md/20"
                >
                  <span className="text-base text-nowrap"><AddRoundedIcon /> Add Event</span>
                </button>
              )}
            </Navigation>
            {activeTab === "events" ? <Calendar events={events} loading={loading} /> : <Scheduler />}
          </div>
        </div>
      </div>
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Create New Event">
        <CreateCalendarEventForm onSuccess={fetchEvents} onClose={() => setOpenCreateModal(false)} />
      </Modal>
    </>
  );
}
