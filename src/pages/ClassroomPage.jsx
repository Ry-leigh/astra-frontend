import api from "../api/axios"
import { useEffect, useState } from "react";
import ClassroomCard from "@/components/elements/ClassroomCard";
import Layout from "@/components/layout/Layout";
import ClassroomPreloader from "@/components/preloaders/ClassroomPreloader";
import ErrorRoute from "@/router/ErrorRoute";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/elements/PageHeader";

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
            <div className="flex flex-col w-full gap-6">
                <PageHeader title={`${program.name} Sections`}>
                    <div className="w-full" />
                    <div className="flex items-center">
                        <p className="font-medium">A.Y.</p>
                        <p className="text-gray-500">&nbsp;&nbsp;|&nbsp;&nbsp;</p>
                        <div>
                            2025 - 2026
                        </div>
                    </div>
                </PageHeader>
            {classrooms.length === 0 ? (
                <p>No classrooms found.</p>
            ) : (
                <div className="flex min-h-9/11 h-full overflow-y-auto scrollbar-none rounded-lg">
                    <div className="w-full h-fit grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {classrooms.map((classroom) => {
                            const shortName = program.name
                                .replace(/^Bachelor of Arts in /i, "BA ")
                                .replace(/^Bachelor of Science in /i, "BS ");

                            return (
                                <ClassroomCard key={classroom.id} classroomId={classroom.id} programName={shortName} yearLevel={classroom.year_level} section={classroom.section || ""} color={program.color} />                    
                            );
                        })}
                    </div>
                </div>
            )}
            </div>
        </Layout>
    );
}