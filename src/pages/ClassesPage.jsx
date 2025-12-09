import api from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import CourseCard from "@/components/elements/CourseCard";
import PageHeader from "@/components/elements/PageHeader";
import { Dropdown } from "@/components/elements/Dropdown";

function toOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');
  const { user } = useAuth();
  const [semesterOptions, setSemesterOptions] = useState();
  const [semester, setSemester] = useState()

  const fetchClasses = async () => {
    try {
      setRole(user.roles[0].name);
      const response = await api.get('/class');
      console.log(response.data);
      if (response.data.success) {
        const today = new Date();
        setClasses(response.data.classes);
        const formattedSemesters = response.data.semester.map(s => ({
          value: s.id,
          label: `${toOrdinal(s.semester)} Semester`
        }));

        response.data.semester.forEach((sem, index) => {
          const startDate = new Date(sem.start_date);
          if (today >= startDate) {
            setSemester(sem.id);
          }
        });
        // role == 'Administrator' ? formattedSemesters.push({ value: -1, label: "Add Semester" }) : null
        setSemesterOptions(formattedSemesters)
      } else {
        throw new Error("Failed to load your classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return (
    <>
    {(role == 'Administrator' || role == 'Insrtuctor') ? "Loading Classes..." : "Loading Courses..."}
    </>
  );

  if (error) return <ErrorRoute code={error} />;

  return (
    <div className="flex flex-col w-full gap-6">
      <PageHeader title={`Your ${role === 'Instructor' || role === 'Administrator' ? 'Classes' : 'Courses'}`}>
        <div className="flex h-full w-fit gap-2 items-center">
          <Dropdown
            label="Semester"
            name="semester"
            value={semester}
            onChange={(e) => { if (e == -1) { setSemesterOptions(semesterOptions[-1]); navigate("/settings") } else { setSemester(e) } }}
            options={semesterOptions}
          />
        </div>
      </PageHeader>
      {classes.length === 0 ? (
        <p>No class found.</p>
      ) : (
        <div className="flex min-h-9/11 w-full h-full overflow-y-auto scrollbar-none rounded-lg">
          <div className="grid h-fit grid-cols-1 w-full lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {classes.map((item) => {
              const course = item.course;
              const program = item.classroom.program.name
                .replace(/^Bachelor of Arts in /i, "BA ")
                .replace(/^Bachelor of Science in /i, "BS ");
              const instructor = item.instructor?.user;
              const courseName = course?.name || "Untitled Course";
              const classroomName = `${program} ${item.classroom.year_level}${item.classroom.section ? item.classroom.section : ''}`
              const courseCode = course?.code || "—";
              const instructorName = instructor
                ? `${instructor.sex == 'M' ? 'Mr. ' : 'Ms. '} ${instructor.first_name} ${instructor.last_name}`
                : "No Instructor";

              if (item.semester_id == semester) {
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
  );
}
