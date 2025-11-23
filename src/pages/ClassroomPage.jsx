import api from "../api/axios"
import { useEffect, useState } from "react";
import ClassroomCard from "@/components/elements/ClassroomCard";
import ClassroomPreloader from "@/components/preloaders/ClassroomPreloader";
import ErrorRoute from "@/router/ErrorRoute";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/elements/PageHeader";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Dropdown } from "@/components/elements/Dropdown";
import Modal from "@/components/elements/Modal";
import CreateClassroomForm from "@/components/forms/CreateClassroomForm";
import EditClassroomForm from "@/components/forms/EditClassroomForm";
import DeleteClassroomModal from "@/components/modals/DeleteClassroomModal";

export default function ClassroomPage() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [program, setProgram] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [academicYear, setAcademicYear] = useState("");
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [academicYearOptionsWithCreate, setAcademicYearOptionsWithCreate] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get(`/classrooms/${id}`);
            console.log(response.data);
            if(response.data.success){
                setClassrooms(response.data.classrooms);
                setProgram(response.data.program);
                const formattedAcademicYears = response.data.academic_years.map(ay => ({
                    value: ay.id,
                    label: `${ay.year_start} – ${ay.year_end}`
                }));
                setAcademicYear(response.data.academic_years.at(-1)?.id)
                setAcademicYearOptions(formattedAcademicYears);
                setAcademicYearOptionsWithCreate(formattedAcademicYears.push({ value: -1, label: "Add A.Y." }))
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
        <>
            <ClassroomPreloader />
        </>
    );

    if (error) return <ErrorRoute code={error} />;

    return(
        <>
            <div className="flex flex-col w-full gap-6">
                <PageHeader title={`${program.name} Sections`}>
                    <div className="flex h-9/10 w-fit items-center gap-3">
                        <div className="flex h-full w-38 gap-2 items-center">
                            <div className="flex h-full w-full">
                                <Dropdown 
                                    label="A.Y."
                                    name="academic_year"
                                    value={academicYear}
                                    onChange={(e) => {if (e == -1) {setAcademicYear(academicYearOptions[-1]); navigate("/settings")} else {setAcademicYear(e)}}}
                                    options={academicYearOptions}
                                />
                            </div>
                        </div>
                        <button type="button" onClick={() => setCreateModalOpen(true)} className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-violet-600 text-white text-sm font-medium cursor-pointer hover:bg-violet-700 hover:shadow-md/20">
                           <AddRoundedIcon/>
                        </button>
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
                                <ClassroomCard 
                                    key={classroom.id}
                                    classroomId={classroom.id}
                                    programName={shortName}
                                    yearLevel={classroom.year_level}
                                    section={classroom.section || ""}
                                    color={program.color}
                                    academicYearId={classroom.academic_year_id}
                                    onEdit={(classroom) => { setSelectedClassroom(classroom); setEditModalOpen(true); }}
                                    onDelete={(classroom) => { setSelectedClassroom(classroom); setDeleteModalOpen(true); }}
                                />                    
                            );
                        })}
                    </div>
                </div>
            )}
            </div>
            <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title={`New ${program.name.replace(/^Bachelor of Arts in /i, "BA ").replace(/^Bachelor of Science in /i, "BS ")} Classroom`}>
                <CreateClassroomForm programId={program.id} academicYearOptions={academicYearOptions} onSuccess={fetchClassrooms} onClose={() => setCreateModalOpen(false)} />
            </Modal>
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit ${program.name.replace(/^Bachelor of Arts in /i, "BA ").replace(/^Bachelor of Science in /i, "BS ")} ${selectedClassroom?.yearLevel}${selectedClassroom?.section}`}>
                <EditClassroomForm
                    programId={program.id}
                    data={selectedClassroom}
                    academicYearOptions={academicYearOptions}
                    onSuccess={fetchClassrooms}
                    onClose={() => setEditModalOpen(false)}
                />
            </Modal>
            <DeleteClassroomModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                classroom={selectedClassroom}
                onSuccess={fetchClassrooms}
            />
        </>
    );
}