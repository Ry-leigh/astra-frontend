import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdownWithSearch({
  label = "Select options",
  value = [],
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const isFilled = value.length > 0;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOption(val) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Label */}
      <label
        className={`
          absolute left-3 bg-white px-1 pointer-events-none transition-all duration-200
          ${isFilled || open ? "-top-2 text-sm text-gray-600" : "top-3.5 text-base text-gray-400"}
          peer-focus:-top-2 peer-focus:text-blue-600 peer-focus:text-sm
        `}
      >
        {label}
      </label>

      {/* Input display area */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`
          peer flex w-full min-h-12 items-center flex-wrap gap-1
          border rounded-xl bg-white px-3 py-2 cursor-pointer select-none
          transition-all duration-150
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
        `}
      >
        {/* Chips */}
        {selectedLabels.length > 0 ? (
          selectedLabels.map((lbl) => (
            <span
              key={lbl}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
            >
              {lbl}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-base"> </span>
        )}

        {/* Arrow Icon */}
        <svg
          className={`
            w-5 h-5 ml-auto text-gray-500 transition-transform duration-150
            ${open ? "rotate-180" : ""}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-auto animate-dropdown scrollbar-none">
          
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="
                w-full px-3 py-2 text-sm border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            />
          </div>

          {/* Option List */}
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-400 text-sm">No results found</li>
            )}

            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className="
                  flex items-center gap-2 px-4 py-2 cursor-pointer
                  hover:bg-gray-100 transition-colors
                "
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  readOnly
                  className="w-4 h-4"
                />
                <span className="text-gray-800">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown {
          animation: dropdown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

// usage:

// const [selectedRoles, setSelectedRoles] = useState([]);

// <MultiSelectDropdownWithSearch
//   label="Roles"
//   value={selectedRoles}
//   onChange={setSelectedRoles}
//   options={[
//     { value: "admin", label: "Administrator" },
//     { value: "staff", label: "Staff" },
//     { value: "student", label: "Student" },
//   ]}
// />

