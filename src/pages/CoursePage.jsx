import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

import ErrorRoute from "@/router/ErrorRoute";
import CourseCard from "@/components/elements/CourseCard";
import CoursePreloader from "@/components/preloaders/CoursePreloader";
import PageHeader from "@/components/elements/PageHeader";
import { Dropdown } from "@/components/elements/Dropdown";

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Modal from "@/components/elements/Modal";
import AddCourseForm from "@/components/forms/AddCourseForm";
import EditClassCourseForm from "@/components/forms/EditClassCourseForm";
import DeleteClassCourseModal from "@/components/modals/DeleteClassCourseModal";

function toOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function CoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classroom, setClassroom] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [semesterId, setSemesterId] = useState(null);
  const [semesterOptions, setSemesterOptions] = useState([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState([])

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      console.log(`/courses/${id}:`, response.data)
      if (response.data.success) {
        setCourses(response.data.courses);
        setClassroom(response.data.classroom);
      } else {
        throw new Error("Failed to load courses");
      }

      const res = await api.get(`courses/add/${id}`);
      console.log(`courses/add/${id}:`, res.data)
      if (res.data.success) {
        const today = new Date();
        const formattedSemesters = res.data.semesters.map(s => ({
          value: s.id,
          label: `${toOrdinal(s.semester)} Semester`
        }));

        res.data.semesters.forEach((sem, index) => {
          const startDate = new Date(sem.start_date);
          if (today >= startDate) {
            setSemesterId(sem.id);
          }
        });
        setSemesterOptions(formattedSemesters)
        formattedSemesters.push({ value: -1, label: "Add Semester" })
      }

    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return (
    <>
      <CoursePreloader />
    </>
  );

  if (error) return <ErrorRoute code={error} />;

  return (
    <>
      <div className="flex flex-col w-full gap-6">
        <PageHeader title={`${classroom.name} Courses`}>
          <div className="flex h-9/10 w-fit items-center gap-3">
            <div className="flex h-full w-42 gap-2 items-center">
              <Dropdown
                label="Semester"
                name="semester"
                value={semesterId}
                onChange={(e) => { if (e == -1) { setSemesterOptions(semesterOptions[-1]); navigate("/settings") } else { setSemesterId(e) } }}
                options={semesterOptions}
              />
            </div>
            <button type="button" onClick={() => setAddCourseModalOpen(true)} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-600 text-white text-sm font-medium cursor-pointer hover:bg-violet-700 hover:shadow-md/20">
              <AddRoundedIcon />
            </button>
          </div>
        </PageHeader>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="flex min-h-9/11 h-full overflow-y-auto scrollbar-none rounded-lg">
            <div className="grid h-fit w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((item) => {
                const c = item
                const course = item.course;
                const instructor = item.instructor?.user;
                const courseName = course?.name || "Untitled Course";
                const courseCode = course?.code || "—";
                const instructorName = instructor
                  ? `${instructor.sex == 'M' ? 'Mr. ' : 'Ms. '} ${instructor.first_name} ${instructor.last_name}`
                  : "No Instructor";

                if (item.semester_id == semesterId) {
                  return (
                    <CourseCard
                      key={item.id}
                      classCourseId={item.id}
                      courseName={courseName}
                      courseInstructor={instructorName}
                      semesterId={item.semester_id}
                      color={item?.color || '#E4E4E4'}
                      onEdit={(item) => { setSelectedCourse(c); setEditModalOpen(true); console.log(c) }}
                      onDelete={(item) => { setSelectedCourse(c); setDeleteModalOpen(true) }}
                    />
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
      <Modal open={addCourseModalOpen} onClose={() => setAddCourseModalOpen(false)} title="Add Course">
        <AddCourseForm
          classroomId={id}
          academicYearId={classroom.academic_year_id}
          semesterId={semesterId}
          onSuccess={fetchCourses}
          onClose={() => setAddCourseModalOpen(false)}
        />
      </Modal>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Course`} >
        <EditClassCourseForm
          data={selectedCourse}
          classroomId={id}
          academicYearId={classroom.academic_year_id}
          semesterId={semesterId}
          onSuccess={fetchCourses}
          onClose={() => setEditModalOpen(false)}
        />
      </Modal>
      <DeleteClassCourseModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        data={selectedCourse}
        classroomId={id}
        onSuccess={fetchCourses}
      />
    </>
  );
}
