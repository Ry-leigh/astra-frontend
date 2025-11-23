import { useEffect, useState } from "react";
import api from "@/api/axios";
import TextInput from "../elements/TextInput";
import DatePicker from "../elements/DatePicker";
import TimePicker from "../elements/TimePicker";
import MultiSelectDropdown from "../elements/MultiSelectDropdown";
import Switch from "../elements/Switch";
import FloatingLabelTextarea from "../elements/FloatingLabelTextarea";

export default function EditAnnouncementForm({ announcementId, onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState(""); 
    const [eventTime, setEventTime] = useState("");
    const [roleOptions, setRoleOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [classroomOptions, setClassroomOptions] = useState([]);
    const [global, setGlobal] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedClassrooms, setSelectedClassrooms] = useState([]);
    const [selectedClassCourses, setSelectedClassCourses] = useState([]);

    const fetchEditData = async (e) => {
        setLoading(true);
        try {
            const res = await api.get("/announcement/create");
            console.log(res.data)
            
            if (res.data.success) {
                setRoleOptions(res.data.roles)
                setProgramOptions(res.data.programs)
                const formattedClassrooms = res.data.classrooms.map(classroom => ({
                    id: classroom.id,
                    name: formatProgramName(classroom.name)
                }))
                setClassroomOptions(formattedClassrooms)
            }

            const response = await api.get(`/announcements/${announcementId}`);
            console.log(response.data)

            if (response.data.success) {
                const { announcements } = response.data;

                announcements.title ? setTitle(announcements.title) : null;
                announcements.description ? setDescription(announcements.description) : null;
                announcements.event_date ? setEventDate(announcements.event_date) : null;
                announcements.event_time ? setEventTime(announcements.event_time.substring(0, 5)) : null;

                const roles = announcements.targets
                    .filter(t => t.target_type === "role")
                    .map(t => t.target_id);

                const programs = announcements.targets
                    .filter(t => t.target_type === "program")
                    .map(t => t.target_id);

                const classrooms = announcements.targets
                    .filter(t => t.target_type === "classroom")
                    .map(t => t.target_id);

                setSelectedRoles(roles);
                setSelectedPrograms(programs);
                setSelectedClassrooms(classrooms);

                const isGlobal =
                    roles.length === 0 &&
                    programs.length === 0 &&
                    classrooms.length === 0;

                setGlobal(isGlobal);
            }
        } catch (err) {
            console.error("Error fetching announcement:", err);
            alert("Failed to load announcement data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEditData();
    }, [announcementId]);

    function formatProgramName(str) {
        const stopWords = ["in", "of", "and"];
        const parts = str.split(/(\d.*$)/);
        const title = parts[0].trim();
        const section = parts[1]?.trim() ?? "";
        const acronym = title
            .split(" ")
            .filter(word => !stopWords.includes(word.toLowerCase()))
            .map(word => word[0].toUpperCase())
            .join("");
        return `${acronym} ${section}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const computedTargets = {
            global,
            roles: selectedRoles,
            programs: selectedPrograms,
            classrooms: selectedClassrooms,
            class_courses: selectedClassCourses,
        };

        if (
            computedTargets.roles.length === 0 &&
            computedTargets.programs.length === 0 &&
            computedTargets.classrooms.length === 0 &&
            computedTargets.class_courses.length === 0
        ) {
            computedTargets.global = true;
        }

        try {
            const response = await api.put(`/announcements/${announcementId}`, {
                title,
                description,
                event_date: eventDate,
                event_time: eventTime,
                targets: computedTargets,
            });

            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error updating announcement:", err);
            alert("Failed to update announcement.");
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return (
        <div className="p-4">
            Loading...
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex gap-6">
            <div className="flex flex-col w-sm gap-4">
                Event Details
                <TextInput
                    name="title"
                    label="Title"
                    value={title}
                    type="text"
                    onChange={e => setTitle(e.target.value)}
                />
                <FloatingLabelTextarea
                    label="Description"
                    name="description"
                    value={description}
                    onChange={setDescription}
                    placeholder="optional"
                />
                <div className="flex items-center gap-2">
                    <DatePicker
                        name="event_date"
                        label="Event Date"
                        value={eventDate}
                        onChange={setEventDate}
                        min="1950-01-01"
                        max="2025-12-31"
                    />
                    <TimePicker
                        name="event_time"
                        label="Event Time"
                        value={eventTime}
                        onChange={setEventTime}
                        step="60"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 w-xs">
                Targets
                <Switch
                    checked={global}
                    onChange={setGlobal}
                    label="Everyone"
                    name="global"
                />
                {!global && (
                    <div className="flex flex-col gap-4">
                        <MultiSelectDropdown
                            label="Roles"
                            name="targets.roles"
                            options={roleOptions}
                            value={selectedRoles}
                            onChange={setSelectedRoles}
                        />
                        <MultiSelectDropdown
                            label="Programs"
                            name="targets.programs"
                            options={programOptions}
                            value={selectedPrograms}
                            onChange={setSelectedPrograms}
                        />
                        <MultiSelectDropdown
                            label="Classrooms"
                            name="targets.classrooms"
                            options={classroomOptions}
                            value={selectedClassrooms}
                            onChange={setSelectedClassrooms}
                        />
                    </div>
                )}
                <div className="h-full"/>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
                >
                    {formLoading ? "Updating..." : "Edit Announcement"}
                </button>
            </div>
        </form>
    );
}
