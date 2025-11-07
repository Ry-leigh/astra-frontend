import api from "../api/axios"
import { useEffect, useState } from "react";
import ClassroomCard from "@/components/atoms/ClassroomCard";
import Layout from "@/components/layout/Layout";
import ClassroomPreloader from "@/components/preloaders/ClassroomPreloader";
import ErrorRoute from "@/router/ErrorRoute";
import { useParams } from "react-router-dom";

export default function ClassroomPage() {
    const { id } = useParams();
    const [program, setProgram] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get(`/classrooms/${id}`);
            console.log(response.data);
            if(response.data.success){
                setClassrooms(response.data.data);
                setProgram(response.data.program);
            } else {
                throw new Error("Failed to load classrooms");
            }
        } catch (error) {
            console.error("Error fetching classrooms:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, [id]);

    if (loading) return (
        <Layout>
            <ClassroomPreloader />
        </Layout>
    );

    if (error) return <ErrorRoute code={error} />;

    return(
        <Layout>
            <div className="">
            <h1 className="text-2xl font-bold mb-4">{program}</h1>
            {classrooms.length === 0 ? (
                <p>No classrooms found.</p>
            ) : (
                <div className="flex flex-wrap overflow-x-auto gap-4">
                    {classrooms.map((classroom) => {
                        const shortName = program
                            .replace(/^Bachelor of Arts in /i, "BA ")
                            .replace(/^Bachelor of Science in /i, "BS ");

                        return (
                            <ClassroomCard key={classroom.id} classroomId={classroom.id} programName={shortName} yearLevel={classroom.year_level} section={classroom.section || ""}  />                    
                        );
                    })}
                </div>
            )}
            </div>
        </Layout>
    );
}