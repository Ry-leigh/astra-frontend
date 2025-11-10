import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import CourseCard from "@/components/elements/CourseCard";
import ClassesPreloader from "@/components/preloaders/ClassesPreloader";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
        const response = await api.get('/class');
        console.log(response.data);
        if (response.data.success) {
            setClasses(response.data.classes);
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
      <Layout>
        <ClassesPreloader />
      </Layout>
    );

  if (error) return <ErrorRoute code={error} />;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Classes</h1>
        {classes.length === 0 ? (
          <p>No class found.</p>
        ) : (
          <div className="flex flex-wrap overflow-x-auto gap-4">
            {classes.map((item) => {
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
