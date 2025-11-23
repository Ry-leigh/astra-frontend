import { useState } from "react";
import api from "@/api/axios";
import TextInput from "../elements/TextInput";
import { FloatingLabelDropdown } from "../elements/Dropdown";

export default function CreateClassroomForm({ programId, onSuccess, onClose, academicYearOptions }) {
    const [loading, setLoading] = useState(false);
    const [yearLevel, setYearLevel] = useState("");
    const [section, setSection] = useState("");
    const [academicYearId, setAcademicYearId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/classrooms", {
                program_id: programId,
                year_level: yearLevel,
                section,
                academic_year_id: academicYearId
            });
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error creating program:", err,);
            alert("Failed to create program.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-2">
                <TextInput 
                    name="year_level"
                    label="Year Level"
                    value={yearLevel}
                    type="text"
                    onChange={(e) => setYearLevel(e.target.value)}
                    placeholder="e.g: 1"
                />
                <TextInput 
                    name="section"
                    label="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g: A"
                />
            </div>

            <div className="flex flex-col h-14 gap-2">
                <FloatingLabelDropdown
                    name="academic_year_id"
                    label="Academic Year"
                    value={academicYearId}
                    onChange={setAcademicYearId}
                    options={academicYearOptions.slice(0, -1)}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
            >
                {loading ? "Creating..." : "Create Program"}
            </button>
        </form>
    );
}
