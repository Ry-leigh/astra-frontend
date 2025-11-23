import { useState } from "react";
import api from "@/api/axios";

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function DeleteAnnouncementModal({
    open,
    onClose,
    announcementId,
    announcementTitle,
    onDeleted,
}) {

    const [confirmText, setConfirmText] = useState("");
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await api.delete(`/announcements/${announcementId}`);

            if (response.data.success) {
                onDeleted?.();
                onClose();
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete announcement.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const canDelete = confirmText === announcementTitle && agree;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-red-600">
                        Delete Announcement
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        <ClearRoundedIcon />
                    </button>
                </div>

                <p className="text-gray-700 mt-3">
                    You're about to delete:
                </p>

                <p className="mt-1 px-3 py-2 bg-gray-100 rounded-md text-gray-900 font-medium">
                    {announcementTitle}
                </p>

                <p className="text-gray-700 mt-4 text-sm">
                    This action <span className="font-semibold">cannot be undone.</span>
                    <br/>Please type the title to confirm:
                </p>

                <input
                    type="text"
                    placeholder="Type the announcement title..."
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-300 focus:outline-none"
                />

                <label className="mt-3 flex items-start gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-red-600"
                    />
                    <span>
                        I understand that this action is <b>irreversible</b> and will
                        permanently delete this announcement.
                    </span>
                </label>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={!canDelete || loading}
                        className={`
                            px-4 py-2 rounded-md text-white font-medium
                            ${canDelete ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}
                        `}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
