import api from "@/api/axios"
import { useEffect, useState } from "react";
import MultiSelectDropdownWithSearch from "../elements/MultiSelectDropdownWithSearch";
import TextInput from "../elements/TextInput";
import FloatingLabelTextarea from "../elements/FloatingLabelTextarea";
import DatePicker from "../elements/DatePicker";
import TimePicker from "../elements/TimePicker";
import { FloatingLabelDropdown } from "../elements/Dropdown";

export default function CreateClassTaskForm({ classCourseId, onSuccess, onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [dueTime, setDueTime] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([
        { value: "assignment", label: "Assignment" },
        { value: "project", label: "Project" },
        { value: "quiz", label: "Quiz" },
        { value: "exam", label: "Exam" },
        { value: "activity", label: "Activity" },
        { value: "other", label: "Other" }
    ]);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await api.post(`/class/${classCourseId}/tasks`, {
                title,
                description,
                due_date: dueDate,
                due_time: dueTime,
                category: selectedCategory
            });
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error creating task:", err,);
            alert("Failed to create task.");
        } finally {
            setFormLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 w-120">
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
                    name="due_date"
                    label="Due Date"
                    value={dueDate}
                    onChange={setDueDate}
                    min="1950-01-01"
                    max="2025-12-31"
                />

                <TimePicker
                    name="due_time"
                    label="Due Time"
                    value={dueTime}
                    onChange={setDueTime}
                    step="60"
                />
            </div>

            <div className="flex flex-col h-14 gap-2">
                <FloatingLabelDropdown
                    name="category"
                    label="Category"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categoryOptions}
                />
            </div>

            <button
                type="submit"
                disabled={formLoading}
                className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
            >
                {formLoading ? "Adding..." : "Add Task"}
            </button>
        </form>
    )
}