import { useState, useEffect } from "react";
import api from "../api/axios"
import Layout from "@/components/layout/Layout";
import ErrorRoute from "@/router/ErrorRoute";
import ProgramCard from "@/components/elements/ProgramCard";
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
            <div className="flex flex-col w-full gap-6">
                <div className="flex w-full bg-white p-3 content-center rounded-lg text-nowrap">
                    <p className="text-lg font-medium">All Programs</p>
                    <div className="w-full" />
                </div>
                {programs.length === 0 ? (
                    <p>No programs found.</p>
                ) : (
                    <div className="flex min-h-9/11 h-full overflow-y-auto scrollbar-none rounded-lg">
                        <div className="grid h-fit grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {programs.map((program) => {
                                const shortName = program.name
                                    .replace(/^Bachelor of Arts in /i, "BA ")
                                    .replace(/^Bachelor of Science in /i, "BS ");

                                return (
                                    <ProgramCard key={program.id} programId={program.id} programName={shortName} programDesc={program.description || "—"} color={program.color} />                    
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}