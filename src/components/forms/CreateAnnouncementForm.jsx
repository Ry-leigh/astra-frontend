import { useEffect, useState } from "react";
import api from "@/api/axios";
import TextInput from "../elements/TextInput";
import DatePicker from "../elements/DatePicker";
import TimePicker from "../elements/TimePicker";
import MultiSelectDropdown from "../elements/MultiSelectDropdown";
import Switch from "../elements/Switch";
import FloatingLabelTextarea from "../elements/FloatingLabelTextarea";

export default function CreateAnnouncementForm({ onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState(""); 
    const [eventTime, setEventTime] = useState("");
    const [roleOptions, setRoleOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [classroomOptions, setClassroomOptions] = useState([]);
    const [classCoursesOptions, setClassCoursesOptions] = useState([]);
    const [global, setGlobal] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedClassrooms, setSelectedClassrooms] = useState([]);
    const [selectedClassCourses, setSelectedClassCourses] = useState([]);
    const [targets, setTargets] = useState({ "global": true, "roles": selectedRoles, "programs": selectedPrograms, "classrooms": selectedClassrooms, "class_courses": selectedClassCourses });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const computedTargets = {
            global: global,
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
        console.log(computedTargets)

        try {
            const response = await api.post("/announcements", {
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
            console.error("Error creating announcement:", err);
            alert("Failed to create announcement.");
        } finally {
            setFormLoading(false);
        }
    };

    function formatProgramName(str) {
        const stopWords = ["in", "of", "and"]; 

        const parts = str.split(/(\d.*$)/);
        const title = parts[0].trim();
        const section = parts[1].trim();

        const acronym = title
            .split(" ")
            .filter(word => !stopWords.includes(word.toLowerCase()))
            .map(word => word[0].toUpperCase())
            .join("");

        return `${acronym} ${section}`;
    }

    const fetchCreateData = async (e) => {
        setLoading(true);

        try {
            const response = await api.get("/announcement/create");
            
            if (response.data.success) {
                setRoleOptions(response.data.roles)
                setProgramOptions(response.data.programs)
                const formattedClassrooms = response.data.classrooms.map(classroom => ({
                    id: classroom.id,
                    name: formatProgramName(classroom.name)
                }))
                
                setClassroomOptions(formattedClassrooms)
            }
        } catch (err) {
            console.error("Error creating announcement:", err,);
            alert("Failed to create announcement.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCreateData()
    }, [])

    return (
        <form onSubmit={handleSubmit} className="flex gap-6">
            <div className="flex flex-col w-sm gap-4">
                Event Details
                <div className="flex flex-col gap-4">
                    <TextInput
                        name="title"
                        label="Title"
                        value={title}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 h-full">
                    <FloatingLabelTextarea
                        label="Description"
                        name="description"
                        value={description}
                        onChange={setDescription}
                        placeholder="optional"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DatePicker
                        name="event_date"
                        label="Event Date"
                        value={eventDate}
                        onChange={(value) => {setEventDate(value); console.log(value)}}
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
                {!global ? (
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
                ) : null}
                

                <div className="h-full"/>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
                >
                    {formLoading ? "Creating..." : "Create Announcement"}
                </button>
            </div>
        </form>
    );
}
