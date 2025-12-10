import api from "../api/axios"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ErrorRoute from "@/router/ErrorRoute";

import dateConverter from "@/components/elements/dateConverter";
import timeConverter from "@/components/elements/timeConverter";

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { NavLink } from "react-router-dom";
import CreateAnnouncementForm from "@/components/forms/CreateAnnouncementForm";
import Modal from "@/components/elements/Modal";
import EditAnnouncementForm from "@/components/forms/EditAnnouncementForm";
import DeleteAnnouncementModal from "@/components/modals/DeleteAnnouncementModal";
import Preloader from "@/components/preloaders/Preloader";

function Navigation({ activeTab, handleTabChange, role, children }) {
  const neutral = "flex gap-3 items-center p-4 pt-7 px-6 text-base";
  const active = "font-medium text-violet-700 border-b-3";
  const inactive = "text-gray-500 border-gray-500/0 border-b-3 hover:text-violet-400";

  return (
    <div className="flex pt-1 pr-1 w-full border-b items-center text-sm border-gray-200 justify-between">
        <div className="flex ">
            <NavLink to="#" end className={`${neutral} ${activeTab === "all" ? active : inactive}`} onClick={() => handleTabChange("all")}>
                <h2>All</h2>
            </NavLink>

            <NavLink to="#" end className={`${neutral} ${activeTab === "general" ? active : inactive}`} onClick={() => handleTabChange("general")}>
                <h2>General</h2>
            </NavLink>
            {(role === 'Administrator') && (
                <NavLink to="#" end className={`${neutral} ${activeTab === "programs" ? active : inactive}`} onClick={() => handleTabChange("programs")}>
                    <h2>Programs</h2>
                </NavLink>
            )}

            <NavLink to="#" end className={`${neutral} ${activeTab === "class" ? active : inactive}`} onClick={() => handleTabChange("class")}>
                <h2>Class</h2>
            </NavLink>
            <NavLink to="#" end className={`${neutral} ${activeTab === "past" ? active : inactive}`} onClick={() => handleTabChange("past")}>
                <h2>Past</h2>
            </NavLink>
        </div>
        {children}
    </div>
  );
}

export default function AnnouncementPage() {
    const [role, setRole] = useState('');
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("all");
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [announcements, setAnnouncements] = useState([]);
    const [targetCatalog, setTargetCatalog] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            setRole(user.roles[0].name);
            const response = await api.get("/announcements");
            console.log(response.data.announcements)
            if (response.data.success) {
                setAnnouncements(response.data.announcements);
                setTargetCatalog(response.data.target_catalog)
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="flex flex-col h-full w-full gap-4">
            <PageHeader title="Announcements"/>

            <div className="flex flex-col h-full overflow-y-auto bg-white w-full px-6 gap-4 rounded-xl">
                <Navigation activeTab={activeTab} handleTabChange={handleTabChange} role={role}>
                    {(role === 'Administrator') && (
                        <button type="button" onClick={() => setOpenCreateModal(true)} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-600 text-white text-base font-medium cursor-pointer hover:bg-violet-700 hover:shadow-md/20">
                            <AddRoundedIcon/> Add Announcement
                        </button>
                    )}
                </Navigation>
                {activeTab === "general" ? <GeneralAnnouncements loading={loading} error={error} role={role} announcements={announcements} targetCatalog={targetCatalog} fetchAnnouncements={fetchAnnouncements}/> 
                : activeTab === "programs" ? <ProgramAnnouncements loading={loading} error={error} role={role} announcements={announcements} targetCatalog={targetCatalog} fetchAnnouncements={fetchAnnouncements}/>
                : activeTab === "class" ? <ClassAnnouncements loading={loading} error={error} role={role} announcements={announcements} targetCatalog={targetCatalog} fetchAnnouncements={fetchAnnouncements}/>
                : activeTab === "past" ? <PastAnnouncements loading={loading} error={error} role={role} announcements={announcements} targetCatalog={targetCatalog} fetchAnnouncements={fetchAnnouncements}/>
                : <AllAnnouncements loading={loading} error={error} role={role} announcements={announcements} targetCatalog={targetCatalog} fetchAnnouncements={fetchAnnouncements}/>}
            </div>
            <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)} title="Create New Announcement">
                <CreateAnnouncementForm  onSuccess={fetchAnnouncements} onClose={() => setOpenCreateModal(false)} />
            </Modal>
        </div>
            
    );
}

function AllAnnouncements({ loading, error, role, announcements, targetCatalog, fetchAnnouncements }) {
    useEffect(() => { fetchAnnouncements(); }, []);

    if (loading) return <Preloader text="Loading announcements"/>;
    if (error) return <ErrorRoute code={error} />;

    return (
        <FilteredAnnouncementList
            role={role}
            announcements={announcements}
            fetchAnnouncements={fetchAnnouncements}
            targetCatalog={targetCatalog}
            emptyText="No announcements available."
        />
    );
}


function GeneralAnnouncements({ loading, error, role, announcements, targetCatalog, fetchAnnouncements }) {
    useEffect(() => { fetchAnnouncements(); }, []);

    if (loading) return <Preloader text="Loading announcements"/>;
    if (error) return <ErrorRoute code={error} />;

    // Filter: global only (visible to everyone)
    const filtered = announcements.filter(a =>
        a.targets.some(t => t.target_type === "global")
    );

    return (
        <FilteredAnnouncementList
            role={role}
            announcements={filtered}
            fetchAnnouncements={fetchAnnouncements}
            targetCatalog={targetCatalog}
            emptyText="No general announcements available."
        />
    );
}

function ProgramAnnouncements({ loading, error, role, announcements, targetCatalog, fetchAnnouncements }) {
    useEffect(() => { fetchAnnouncements(); }, []);

    if (loading) return <Preloader text="Loading announcements"/>;
    if (error) return <ErrorRoute code={error} />;

    // Filter: any target that is a program
    const filtered = announcements.filter(a =>
        a.targets.some(t => t.target_type === "program")
    );

    return (
        <FilteredAnnouncementList
            role={role}
            announcements={filtered}
            fetchAnnouncements={fetchAnnouncements}
            targetCatalog={targetCatalog}
            emptyText="No program announcements found."
        />
    );
}

function ClassAnnouncements({ loading, error, role, announcements, targetCatalog, fetchAnnouncements }) {
    useEffect(() => { fetchAnnouncements(); }, []);

    if (loading) return <Preloader text="Loading announcements"/>;
    if (error) return <ErrorRoute code={error} />;

    // Filter: target_type === "class_course"
    const filtered = announcements.filter(a =>
        a.targets.some(t => t.target_type === "class_course")
    );

    return (
        <FilteredAnnouncementList
            role={role}
            announcements={filtered}
            fetchAnnouncements={fetchAnnouncements}
            targetCatalog={targetCatalog}
            emptyText="No class announcements available."
        />
    );
}

function PastAnnouncements({ loading, error, role, announcements, targetCatalog, fetchAnnouncements }) {
    useEffect(() => { fetchAnnouncements(); }, []);

    if (loading) return <Preloader text="Loading announcements"/>;
    if (error) return <ErrorRoute code={error} />;

    const today = new Date();

    // Past = event_date exists AND earlier than today
    const filtered = announcements.filter(a => {
        if (!a.event_date) return false;
        return new Date(a.event_date) < today;
    });

    return (
        <FilteredAnnouncementList
            role={role}
            announcements={filtered}
            fetchAnnouncements={fetchAnnouncements}
            targetCatalog={targetCatalog}
            emptyText="No past announcements found."
        />
    );
}

function FilteredAnnouncementList({ role, announcements, fetchAnnouncements, targetCatalog, emptyText }) {
    const [selectedId, setSelectedId] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState(null);

    function formatProgramName(str) {
        const stopWords = ["in", "of", "and"];
        const parts = str.split(/(\d.*$)/);
        const title = parts[0].trim();
        const section = parts[1]?.trim();
        const acronym = title
            .split(" ")
            .filter(w => !stopWords.includes(w.toLowerCase()))
            .map(w => w[0].toUpperCase())
            .join("");
        return `${acronym} ${section ?? ""}`;
    }

    const getTargetName = (target) => {
        if (target.target_type === "global") return "Everyone";

        const list = targetCatalog[target.target_type];
        if (!list) return "";

        const item = list.find(entry => entry.id === target.target_id);
        if (!item) return "";

        if (target.target_type === "role") return `${item.name}s`;
        return formatProgramName(item.name);
    };

    if (!announcements.length)
        return <div className="p-4 text-gray-500">{emptyText}</div>;

    return (
        <div className="flex flex-col h-full mb-4 px-2 overflow-y-scroll scrollbar-none gap-3">
            {announcements.map(a => (
                <div key={a.id} className={`flex border items-center border-gray-200 rounded-md px-4 py-3 gap-4 text-nowrap ${role == "Administrator" ? "justify-between" : ""}`}>
                    {/* DATETIME */}
                    <div className="flex items-center w-fit h-full gap-4">
                        <div className="flex flex-col w-18 gap-0.5">
                            <div className="flex justify-end truncate">
                                {a.event_date ? dateConverter(a.event_date) : "TBD"}
                            </div>
                            <div className="flex justify-end truncate">
                                {a.event_date ? (a.event_time ? timeConverter(a.event_time) : "All Day") : "TBD"}
                            </div>
                        </div>

                        <div className="border-l-2 border-gray-300 h-9/10" />

                        {/* TITLE + DESC */}
                        <div className="flex flex-col h-15 justify-center gap-1">
                            <div className="text-lg font-medium">{a.title}</div>
                            <div className="text-sm text-gray-600">{a.description}</div>
                        </div>
                    </div>

                    {/* ADMIN CONTROLS */}
                    {role === "Administrator" && (
                        <div className="flex items-center w-fit h-full gap-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="flex justify-end">Visible to:</span>
                                <div className="flex text-sm max-w-xs text-wrap gap-1.5 justify-end">
                                    {a.targets.map((t, i) => (
                                        <div key={i} className="bg-blue-100 text-xs rounded-sm py-0.5 px-1.5">
                                            {getTargetName(t)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(a.id);
                                        setOpenEditModal(true);
                                    }}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-lg text-gray-800 hover:bg-gray-200 transition"
                                >
                                    <EditRoundedIcon fontSize="inherit" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(a.id);
                                        setAnnouncementTitle(a.title);
                                        setOpenDeleteModal(true);
                                    }}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-lg text-red-600 hover:bg-red-100 transition"
                                >
                                    <IndeterminateCheckBoxOutlinedIcon fontSize="inherit" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* MODALS */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)} title="Edit Announcement">
                <EditAnnouncementForm announcementId={selectedId} onSuccess={fetchAnnouncements} onClose={() => setOpenEditModal(false)} />
            </Modal>

            <DeleteAnnouncementModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                announcementId={selectedId}
                announcementTitle={announcementTitle}
                onDeleted={fetchAnnouncements}
            />
        </div>
    );
}
