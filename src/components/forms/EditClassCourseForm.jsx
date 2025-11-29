import { useEffect, useState } from "react";
import api from "@/api/axios";
import { FloatingLabelDropdown } from "../elements/Dropdown";
import ColorPicker from "../elements/ColorPicker";

function toOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function EditClassCourseForm({ data, classroomId, academicYearId, semesterId, onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)
    const [courseId, setCourseId] = useState(null)
    const [instructorId, setInstructorId] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(semesterId)
    const [courseOptions, setCourseOptions] = useState([])
    const [instructorOptions, setInstructorOptions] = useState([])
    const [semesterOptions, setSemesterOptions] = useState([])
    const [color, setColor] = useState("#3B82F6")

    useEffect(() => {
        if (data) {
            setLoading(true)
            setCourseId(data.course_id)
            setInstructorId(data.instructor_id)
            setSelectedSemester(data.semester_id)
            setColor(data.color)
            console.log(data)
        }
        setLoading(false)
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await api.put(`/courses/${classroomId}/${data?.id}`, {
                course_id: courseId,
                instructor_id: instructorId,
                academic_year_id: academicYearId,
                semester: selectedSemester,
                color
            });
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error updating course:", err,);
            alert("Failed to update course.");
        } finally {
            setFormLoading(false);
        }
    };

    const fetchCreateData = async (e) => {
        setLoading(true);

        try {
            const response = await api.get(`/courses/add/${classroomId}`);
            console.log(response.data)
            if (response.data.success) {
                const formattedSemesters = response.data.semesters?.map(s => ({
                    value: s.id,
                    label: `${toOrdinal(s.semester)} Semester`
                }));
                setSemesterOptions(formattedSemesters)

                const formattedCourses = response.data.courses?.map(c => ({
                    value: c.id,
                    label: c.name
                }));
                setCourseOptions(formattedCourses)

                const formattedInstructors = response.data.instructors?.map(i => ({
                    value: i.id,
                    label: `${i.user.sex == 'M' ? 'Mr.' : (i.user.sex == 'F' ? "Ms." : '') } ${i.user.first_name} ${i.user.last_name}`
                }));
                setInstructorOptions(formattedInstructors)
            }
        } catch (err) {
            console.error("Error fetching data:", err,);
            alert("Failed to fetch create data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCreateData()
    }, [])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-xs">
            <div className="flex flex-col h-14 gap-2">
                <FloatingLabelDropdown
                    name="course_id"
                    label="Course"
                    value={courseId}
                    onChange={setCourseId}
                    options={courseOptions}
                />
            </div>
            <div className="flex flex-col h-14 gap-2">
                <FloatingLabelDropdown
                    name="instructor_id"
                    label="Instructor"
                    value={instructorId}
                    onChange={setInstructorId}
                    options={instructorOptions}
                />
            </div>
            <div className="flex flex-col h-14 gap-2">
                <FloatingLabelDropdown
                    name="semester_id"
                    label="Semester"
                    value={selectedSemester}
                    onChange={setSelectedSemester}
                    options={semesterOptions}
                />
            </div>
            <ColorPicker
                label="Course Color"
                value={color}
                onChange={setColor}
            />
            <button
                type="submit"
                disabled={formLoading}
                className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
            >
                {formLoading ? "Updating..." : "Edit Course"}
            </button>
        </form>
    )
}