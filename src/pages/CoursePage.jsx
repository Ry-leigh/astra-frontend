import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import CourseCard from "@/components/atoms/CourseCard";
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
      <Layout>
        <CoursePreloader />
      </Layout>
    );

  if (error) return <ErrorRoute code={error} />;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-4">{classroom} Courses</h1>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="flex flex-wrap overflow-x-auto gap-4">
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
        )}
      </div>
    </Layout>
  );
}
