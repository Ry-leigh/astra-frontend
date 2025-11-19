import { useState } from "react";
import api from "@/api/axios";

export default function CreateProgramForm({ onSuccess, onClose }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#D5D8E4"); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/programs", {
                name,
                description,
                color
            });
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error("Error creating program:", err,);
            alert("Failed to create program.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Program Name</label>
                <input type="text" required className="border border-gray-500 rounded-md px-3 py-2" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bachelor of Science in Information Systems">
                
                </input>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea className="border border-gray-500 rounded-md px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description">

                </textarea>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Color</label>
                <input type="color" className="h-10 w-20" value={color}
                    onChange={e => setColor(e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full h-fit justify-center py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-md font-medium hover:bg-blue-500"
            >
                {loading ? "Creating..." : "Create Program"}
            </button>
        </form>
    );
}
