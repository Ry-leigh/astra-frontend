import { useEffect, useState } from "react";
import api from "@/api/axios";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function DeleteClassroomModal({ open, onClose, classroom, onSuccess }) {
    const [name, setName] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (classroom) {
            setName(classroom.name)
            setConfirmText("");
            setAgree(false);
        }
    }, [classroom])

    if (!open || !classroom) return null;

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await api.delete(`/classrooms/${classroom.id}`);

            if (response.data.success) {
                onSuccess();    // refresh list
                onClose();      // close modal
            }

        } catch (err) {
            console.error(err);
            alert("Failed to delete program.");
        } finally {
            setLoading(false);
        }
    };

    const isDisabled =
        confirmText !== classroom.name || !agree || loading;

    return (
        <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-red-600">Delete Classroom</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        <ClearRoundedIcon />
                    </button>
                </div>

                <p className="text-sm/5 text-gray-700">
                    You are about to permanently delete the classroom:
                    <span className="font-semibold"> {name}</span>.  
                    This action <span className="font-bold text-red-600">cannot be undone</span>.
                </p>

                {/* Confirm text */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Type <span className="font-semibold">"{classroom.name}"</span> to confirm:</label>
                    <input
                        type="text"
                        className="border border-gray-400 rounded-md px-3 py-2"
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
                        placeholder={classroom.name}
                    />
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                    />
                    <span>I understand this action is <b>irreversible</b>.</span>
                </label>

                {/* Delete button */}
                <button
                    disabled={isDisabled}
                    onClick={handleDelete}
                    className={`w-full py-2 rounded-md text-white font-medium
                        ${isDisabled ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
                    `}
                >
                    {loading ? "Deleting..." : `Delete ${classroom.name}`}
                </button>
            </div>
        </div>
    );
}
