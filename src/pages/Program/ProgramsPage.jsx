import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import ProgramCard from "../../components/ProgramCard";
import AppLogo from "../../components/AppLogo";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPrograms = async () => {
    try {
      const response = await axiosClient.get("/admin/programs");
      setPrograms(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setLoading(false);
    }
  };

  // Delete a program by ID
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      await axiosClient.delete(`/admin/programs/${id}`);
      setMessage("Program deleted successfully.");
      setPrograms(programs.filter((program) => program.id !== id)); // update UI instantly
    } catch (error) {
      console.error("Error deleting program:", error);
      setMessage("Failed to delete program.");
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);


  if (loading) return <AppLogo />;

 return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Programs</h1>
      <a href="/programs/create" className="text-blue-500 underline mb-4 inline-block">
        Create Program
      </a>

      {message && <p className="text-sm text-gray-600 mb-2">{message}</p>}

      <ul className="space-y-4">
        {programs.map((program) => (
          <a href={`/classrooms/${program.id}`}>
            <li key={program.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{program.name}</h2>
              <p className="text-gray-600 mb-3">{program.description}</p>
              <div className="space-x-4">
                <button
                  onClick={() => handleDelete(program.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete Program
                </button>
                <a
                  href={`/programs/update/${program.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit Program
                </a>
              </div>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
}