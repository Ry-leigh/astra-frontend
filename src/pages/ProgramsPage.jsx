import { useState, useEffect } from "react";
import api from "../api/axios"
import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import ProgramCard from "@/components/atoms/ProgramCard";
import ProgramPreloader from "@/components/preloaders/ProgramPreloader";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograms = async () => {
        try {
            const response = await api.get("/programs");
            console.log(response);
            if (response.data.success) {
            setPrograms(response.data.data);
            } else {
            throw new Error("Failed to load programs");
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
            setError(error?.response?.status || 404);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    if (loading) return (
        <Layout>
            <ProgramPreloader />
        </Layout>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <Layout>
            <div className="">
            <h1 className="text-2xl font-bold mb-4">Programs</h1>
            {programs.length === 0 ? (
                <p>No programs found.</p>
            ) : (
                <div className="flex flex-wrap overflow-x-auto gap-4">
                    {programs.map((program) => {
                    const shortName = program.name
                        .replace(/^Bachelor of Arts in /i, "BA ")
                        .replace(/^Bachelor of Science in /i, "BS ");

                    return (
                        <ProgramCard key={program.id} programId={program.id} programName={shortName} programDesc={program.description || "—"} />                    
                    );
                    })}
                </div>
            )}
            </div>
        </Layout>
    );
}