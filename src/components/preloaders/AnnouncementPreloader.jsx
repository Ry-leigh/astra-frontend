export default function AnnouncementPreloader() {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white w-full shadow-xs px-6 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="sticky top-0 bg-white">
                    <tr>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Time</th>
                        <th className="px-4 py-3 pt-6 text-left font-semibold text-gray-700">Notified</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
                            Loading announcements...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}