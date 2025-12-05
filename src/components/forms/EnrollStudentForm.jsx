import api from "@/api/axios"
import { useEffect, useState } from "react";
import MultiSelectDropdownWithSearch from "../elements/MultiSelectDropdownWithSearch";

export default function EnrollStudentForm({ classCourseId, onSuccess, onClose }) {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)

    const fetchEnrollees = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/class/${classCourseId}/students`);
            console.log(response.data)
            if(response.data.success){
                const formattedStudents = response.data.students.map(student => ({
                    value: student.id,
                    label: `${student.user.first_name} ${student.user.last_name}`
                }));
                setStudentOptions(formattedStudents)
            } else {
                throw new Error("Failed to load students");
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const responses = await Promise.all(
                selectedStudents.map(studentId =>
                    api.post(`/class/${classCourseId}/enroll`, {
                        student_id: studentId
                    })
                )
            );
            if (responses[responses.length - 1].data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error enrolling student:", err);
            alert("Failed to enroll student.");
        } finally {
            setFormLoading(false);
        }
    };


    useEffect(() => {
        fetchEnrollees();
    }, [])
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <MultiSelectDropdownWithSearch
                label="Enrollees"
                value={selectedStudents}
                onChange={setSelectedStudents}
                options={studentOptions}
                />
            </div>
            <button
                type="submit"
                disabled={loading || formLoading}
                className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
            >
                {formLoading ? "Enrolling..." : `Enroll Student${selectedStudents.length > 1 ? 's' : ''}`}
            </button>
        </form>
    )
}