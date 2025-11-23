import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import ErrorRoute from "@/router/ErrorRoute";
import CourseCard from "@/components/elements/CourseCard";
import CoursePreloader from "@/components/preloaders/CoursePreloader";

export default function CoursePage() {
  const { id } = useParams(); 
  const [classroom, setClassroom] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      console.log(response.data);

      if (response.data.success) {
        setCourses(response.data.courses);
        setClassroom(response.data.classroom.name);
      } else {
        throw new Error("Failed to load courses");
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
        <div className="flex w-full bg-white p-3 content-center rounded-lg text-nowrap">
            <p className="text-lg font-medium">{classroom} Courses</p>
            <div className="w-full" />
            <div className="flex items-center">
                <p className="font-medium">Semester</p>
                <p className="text-gray-500">&nbsp;&nbsp;|&nbsp;&nbsp;</p>
                <div>
                    1st Sem
                </div>
            </div>
        </div>    
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="flex min-h-9/11 h-full overflow-y-auto scrollbar-none rounded-lg">
            <div className="grid h-fit w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((item) => {
                const course = item.course;
                const instructor = item.instructor?.user;
                const courseName = course?.name || "Untitled Course";
                const courseCode = course?.code || "—";
                const instructorName = instructor
                  ? `${instructor.sex == 'M' ? 'Mr. ' : 'Ms. '} ${instructor.first_name} ${instructor.last_name}`
                  : "No Instructor";

                return (
                  <CourseCard
                    key={item.id}
                    classCourseId={item.id}
                    courseName={courseName}
                    courseInstructor={instructorName}
                    semester={item.semester}
                    color={item?.color || 'E4E4E4'}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
