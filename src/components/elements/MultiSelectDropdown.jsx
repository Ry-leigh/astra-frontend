import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  label = "Select options",
  options = [],          // [{ id: 1, name: 'Admin' }]
  value = [],            // [1, 2]
  onChange = () => {},
  name = "",
  disabled = false,      // New disabled prop
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOption = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const isSelected = (id) => value.includes(id);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Main select box */}
      <div
        className={`border rounded-xl px-4 py-3 transition-all duration-200 min-h-13
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor text-gray-400" : "bg-white cursor-pointer"}
        `}
        onClick={() => !disabled && setOpen(!open)}
      >
        {/* Floating Label */}
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none px-1
            ${open ? "text-xs -top-2 text-blue-400" : value.length > 0 ? "text-xs -top-2 text-gray-500" : "top-3.5 text-gray-500"}
            ${disabled ? "bg-gray-100" : "bg-white"}
          `}
        >
          {label}
        </label>

        {/* Selected values */}
        <div className={`text-sm ${disabled ? "text-gray-400" : "text-gray-900"}`}>
          {value.length > 0
            ? options
                .filter((o) => value.includes(o.id))
                .map((o) => o.name)
                .join(", ")
            : ""}
        </div>
      </div>

      {/* Dropdown options */}
      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg py-1 shadow-md max-h-56 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`px-4 py-2 text-sm flex items-center gap-2
                ${isSelected(opt.id) ? "bg-blue-50" : ""}
                ${disabled ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
              `}
              onClick={() => !disabled && toggleOption(opt.id)}
            >
              <input
                type="checkbox"
                checked={isSelected(opt.id)}
                readOnly
                disabled={disabled}
                className={`w-4 h-4 accent-blue-600 ${disabled ? "cursor-not-allowed" : ""}`}
              />
              <span>{opt.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hidden input for forms */}
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}
    </div>
  );
}

