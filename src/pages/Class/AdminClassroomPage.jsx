import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";

export default function AdminClassroomsPage() {
  const { id } = useParams();
  const [program, setProgram] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchClassrooms = async () => {
    try {
      const response = await axiosClient.get(`/admin/classrooms/${id}`);
      setClassrooms(response.data.data);
      setProgram(response.data.program);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(false);
    }
  };

  // Delete a program by ID
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await axiosClient.delete(`/admin/classrooms/${id}`);
      setMessage("Class deleted successfully.");
      setClassrooms(classrooms.filter((classrooms) => classrooms.id !== id)); // update UI instantly
    } catch (error) {
      console.error("Error deleting class:", error);
      setMessage("Failed to delete class.");
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);


  if (loading) return (<p>Loading Classes...</p>);

 return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{program} Classrooms</h1>
      <a href="/classrooms/create" className="text-blue-500 underline mb-4 inline-block">
        Create Classroom
      </a>

      {message && <p className="text-sm text-gray-600 mb-2">{message}</p>}

      <ul className="space-y-4">
        {classrooms.map((classroom) => (
          <li key={classroom.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-xl font-semibold">{classroom.name}</h2>
            <p className="text-gray-600 mb-3">{classroom.description}</p>
            <div className="space-x-4">
              <button
                onClick={() => handleDelete(classroom.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete Program
              </button>
              <a
                href={`/programs/update/${classroom.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit Program
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}