import { useEffect, useState } from "react";
import api from "@/api/axios";
import TextInput from "../elements/TextInput";
import DatePicker from "../elements/DatePicker";
import TimePicker from "../elements/TimePicker";
import MultiSelectDropdown from "../elements/MultiSelectDropdown";
import Switch from "../elements/Switch";
import FloatingLabelTextarea from "../elements/FloatingLabelTextarea";
import { FloatingLabelDropdown } from "../elements/Dropdown";
import SearchableDropdown from "../elements/SearchableDropdown";
import dayjs from "dayjs"


export default function CreateCalendarEventForm({ onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [allDay, setAllDay] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([
        { value: "holiday", label: "Holiday" },
        { value: "event", label: "Event" },
        { value: "meeting", label: "Meeting" },
        { value: "makeup_class", label: "Makeup Class" }
    ])
    const [room, setRoom] = useState()
    const [repeatOptions, setRepeatOptions] = useState([])
    const [repeats, setRepeats] = useState("none")
    const [selectedCategory, setSelectedCategory] = useState("event")
    const [selectedClass, setSelectedClass] = useState(null)
    const [addAnnouncement, setAddAnnouncement] = useState(false)
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

    const formatTime = (t) => t ? `${t}:00` : null;

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

        try {
            const response = await api.post("/calendars", {
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                all_day: allDay,
                start_time: formatTime(startTime),
                end_time: formatTime(endTime),
                category: selectedCategory,
                class_course_id: selectedClass,
                room: room,
                repeats: repeats,
                targets: computedTargets,
            });

            if (addAnnouncement) {
                const res = await api.post("/announcements", {
                    title,
                    description,
                    event_date: startDate,
                    event_time: startTime,
                    targets: computedTargets,
                });
            }

            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error creating event:", err);
            alert("Failed to create event.");
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

    const fetchCreateData = async () => {
        setLoading(true);

        try {
            const response = await api.get("/calendar/create");

            if (response.data.success) {
                setRoleOptions(response.data.roles)
                setProgramOptions(response.data.programs)
                const formattedClassrooms = response.data.classrooms.map(classroom => ({
                    id: classroom.id,
                    name: formatProgramName(classroom.name)
                }))

                setClassroomOptions(formattedClassrooms)

                console.log(response.data.class_courses)
                const formattedClasses = response.data.class_courses.map(classCourse => ({
                    value: classCourse.id,
                    label: classCourse.name
                }))

                setClassCoursesOptions(formattedClasses)
            }
        } catch (err) {
            console.error("Error fetching calendar fields:", err,);
            alert("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCreateData()
    }, [])

    return (
        <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex flex-col w-sm gap-5">
                <div className="flex flex-col gap-4">
                    Event Details
                    <TextInput
                        name="title"
                        label="Title"
                        value={title}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 h-fit">
                    <FloatingLabelTextarea
                        label="Description"
                        name="description"
                        value={description}
                        onChange={setDescription}
                        placeholder="optional"
                    />
                </div>

                <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full items-center gap-2">
                        <div className="w-full">
                            <DatePicker
                                name="start_date"
                                label="Start Date"
                                value={startDate}
                                onChange={(value) => { setStartDate(value); console.log(value) }}
                                min="1950-01-01"
                                max="2025-12-31"
                            />
                        </div>
                        {((endDate != startDate && endDate != null) || allDay) && (
                            <>
                                <div>–</div>
                                <div className="w-full">
                                    <DatePicker
                                        name="end_date"
                                        label="End Date"
                                        value={endDate}
                                        onChange={(value) => { setEndDate(value); console.log(value) }}
                                        min="1950-01-01"
                                        max="2025-12-31"
                                    />
                                </div>
                            </>
                        )}

                    </div>
                    {(dayjs(endDate).isBefore(dayjs(startDate))) && (<p className="text-xs text-red-400 pl-1">Event must start before it finishes</p>)}
                </div>


                {!allDay && (
                    <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <TimePicker
                                name="start_time"
                                label="Time Start"
                                value={startTime}
                                onChange={(value) => { setStartTime(value); console.log(value < endTime) }}
                                step="60"
                            />
                            –
                            <TimePicker
                                name="end_time"
                                label="Time End"
                                value={endTime}
                                onChange={(value) => { setEndTime(value); console.log(value) }}
                                step="60"
                            />
                        </div>
                        {(endTime < startTime) && (<p className="text-xs text-red-400 pl-1">Event must start before it finishes</p>)}
                    </div>
                )}

                <Switch
                    checked={allDay}
                    onChange={(value) => { setAllDay(value); if (value) { setEndDate(startDate); setStartTime(null); setEndTime(null); } else { setEndDate(null); } }}
                    label="All Day"
                    name="all_day"
                />

                <div className="h-13">
                    <FloatingLabelDropdown
                        name="category"
                        label="Category"
                        value={selectedCategory}
                        onChange={(value) => { setSelectedCategory(value); if (value == "makeup_class") { setGlobal(false); setSelectedRoles([]); setSelectedPrograms([]); setSelectedClassrooms([]) } else {setGlobal(true)} }}
                        options={categoryOptions}
                    />
                </div>
                {selectedCategory == "makeup_class" && (
                    <SearchableDropdown
                        label="Make-up class to"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        options={classCoursesOptions}
                    />
                )}
            </div>
            <div className="flex flex-col gap-4 w-xs">
                Add Announcement
                <Switch
                    checked={addAnnouncement}
                    onChange={setAddAnnouncement}
                    label="Add Announcement"
                    name="add_announcement"
                />
                Visible To
                <Switch
                    disabled={selectedCategory == "makeup_class"}
                    checked={global}
                    onChange={setGlobal}
                    label="Everyone"
                    name="global"
                />
                {!global && selectedCategory != "makeup_class" ? (
                    <div className="flex flex-col gap-4">
                        <MultiSelectDropdown
                            disabled={selectedCategory == "makeup_class"}
                            label="Roles"
                            name="targets.roles"
                            options={roleOptions}
                            value={selectedRoles}
                            onChange={setSelectedRoles}
                        />
                        <MultiSelectDropdown
                            disabled={selectedCategory == "makeup_class"}
                            label="Programs"
                            name="targets.programs"
                            options={programOptions}
                            value={selectedPrograms}
                            onChange={setSelectedPrograms}
                        />
                        <MultiSelectDropdown
                            disabled={selectedCategory == "makeup_class"}
                            label="Classrooms"
                            name="targets.classrooms"
                            options={classroomOptions}
                            value={selectedClassrooms}
                            onChange={setSelectedClassrooms}
                        />
                    </div>
                ) : null}
                {selectedCategory == "makeup_class" && (
                    <SearchableDropdown
                        label="Class"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        options={classCoursesOptions}
                    />
                )}


                <div className="h-full" />

                <button
                    type="submit"
                    disabled={formLoading}
                    className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
                >
                    {formLoading ? "Creating..." : `Create Event ${addAnnouncement ? "& Announcement" : ""}`}
                </button>
            </div>
        </form>
    );
}
