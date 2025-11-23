export default function Switch({
    checked = false,
    onChange = () => {},
    label = "",
    name = "",
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            
            {/* Switch */}
            <div
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${checked ? "bg-blue-600" : "bg-gray-300"}
                `}
                onClick={() => onChange(!checked)}
            >
                {/* Knob */}
                <div
                    className={`
                        absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md 
                        transform transition-transform duration-200
                        ${checked ? "translate-x-6" : "translate-x-0"}
                    `}
                />
            </div>

            {/* Optional label */}
            {label && (
                <span className="text-gray-800 text-sm">{label}</span>
            )}

            {/* Optional name (hidden input for forms) */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={checked ? "1" : "0"}
                />
            )}
        </label>
    );
}
