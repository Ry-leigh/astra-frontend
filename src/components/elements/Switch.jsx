export default function Switch({
  checked = false,
  onChange = () => {},
  label = "",
  name = "",
  disabled = false,
}) {
  return (
    <label
      className={`flex items-center gap-3 select-none
        ${disabled ? "opacity-90" : "cursor-pointer"}
      `}
    >
      {/* Switch */}
      <div
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${checked ? "bg-blue-600" : "bg-gray-300"}
          ${disabled ? "opacity-50" : ""}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        {/* Knob */}
        <div
          className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md 
            transform transition-transform duration-200
            ${checked ? "translate-x-6" : "translate-x-0"}
            ${disabled ? "opacity-70" : ""}
          `}
        />
      </div>

      {/* Optional label */}
      {label && (
        <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-800"}`}>
          {label}
        </span>
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
