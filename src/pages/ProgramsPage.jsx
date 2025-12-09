import { useState, useEffect } from "react";
import api from "../api/axios"

import AddRoundedIcon from '@mui/icons-material/AddRounded';

import ErrorRoute from "@/router/ErrorRoute";
import ProgramCard from "@/components/elements/ProgramCard";
import PageHeader from "@/components/elements/PageHeader";
import Modal from "@/components/elements/Modal";

import CreateProgramForm from "@/components/forms/CreateProgramForm";
import EditProgramForm from "@/components/forms/EditProgramForm";
import DeleteProgramModal from "@/components/modals/DeleteProgramModal";
import Preloader from "@/components/preloaders/Preloader";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

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
        <Preloader text="Loading programs"/>
    );

    if (error) return <ErrorRoute code={error} />;

    return (
        <>
            <div className="flex flex-col h-full w-full gap-4">
                <PageHeader title="All Programs">
                    <div className="flex h-9/10 w-fit items-center gap-3">
                        <button onClick={() => setOpenModal(true)} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-600 text-white text-sm font-medium cursor-pointer hover:bg-violet-700 hover:shadow-md/20">
                            <span className="flex text-base gap-2"><AddRoundedIcon />Create Program</span>
                        </button>
                    </div>
                </PageHeader>
                {programs.length === 0 ? (
                    <p>No programs found.</p>
                ) : (
                    <div className="flex min-h-9/11 h-full w-full overflow-y-auto scrollbar-none rounded-lg px-2 py-1">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-full w-full gap-4">
                            {programs.map((program) => {
                                const shortName = program.name
                                    .replace(/^Bachelor of Arts in /i, "BA ")
                                    .replace(/^Bachelor of Science in /i, "BS ");

                                return (
                                    <ProgramCard
                                        key={program.id}
                                        programId={program.id}
                                        programName={shortName}
                                        programDesc={program.description || "—"}
                                        color={program.color}
                                        onEdit={(program) => { setSelectedProgram(program); setEditModal(true); }}
                                        onDelete={(program) => { setSelectedProgram(program); setDeleteModalOpen(true); }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)} title="Create New Program">
                <CreateProgramForm onSuccess={fetchPrograms} onClose={() => setOpenModal(false)} />
            </Modal>
            <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Program">
                <EditProgramForm
                    data={selectedProgram}
                    onSuccess={fetchPrograms}
                    onClose={() => setEditModal(false)}
                />
            </Modal>
            <DeleteProgramModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                program={selectedProgram}
                onSuccess={fetchPrograms}
            />
        </>
    )
}