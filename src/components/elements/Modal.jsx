import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

export default function Modal({ open, onClose, children, title }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="flex flex-col bg-white rounded-lg shadow-lg w-full max-w-md p-8 gap-6 animate-fadeIn">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
                        <ClearRoundedIcon/>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
