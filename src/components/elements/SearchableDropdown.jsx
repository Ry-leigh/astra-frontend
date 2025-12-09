import { useState, useEffect, useRef } from "react";

export default function SearchableDropdown({
  label = "Select option",
  value = "",
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState("down"); // 👈 NEW
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null); // 👈 NEW

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || "";
  const isFilled = Boolean(value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  // 🔍 Detect when dropdown should flip
  useEffect(() => {
    if (!open) return;

    const wrapper = wrapperRef.current;
    const dropdown = dropdownRef.current;

    const wrapperRect = wrapper.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;

    const spaceBelow = window.innerHeight - wrapperRect.bottom;
    const spaceAbove = wrapperRect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDirection("up");
    } else {
      setDirection("down");
    }
  }, [open, filteredOptions.length]);

  // Close on click-outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Label */}
      <label
        className={`
          absolute left-3 bg-white px-1 pointer-events-none transition-all duration-200
          ${open ? "text-blue-400" : "text-gray-500"} 
          ${isFilled ? "-top-2 text-sm" : "top-3.5 text-base"}
        `}
      >
        {label}
      </label>

      {/* Input Box */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`
          peer flex items-center w-full min-h-13 px-3 py-2 border rounded-xl bg-white cursor-pointer
          transition-all duration-150 select-none
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
        `}
      >
        <span className={`text-gray-800 ${value ? "" : "text-transparent"}`}>
          {displayLabel || ""}
        </span>

        <svg
          className={`w-5 h-5 ml-auto text-gray-500 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-0 right-0 bg-white border rounded-xl shadow-lg border-gray-200 z-20
            animate-dropdown overflow-hidden
            ${direction === "down" ? "mt-1 top-full" : "bottom-full mb-1"}  /* 👈 FLIP HERE */
          `}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <ul className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-400">No results found</li>
            )}

            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between ${value === opt.value ? "bg-blue-100" : ""}`}
              >
                <span className="text-gray-800">{opt.label}</span>
                {value === opt.value && (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
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
        .animate-dropdown { animation: dropdown 0.15s ease-out; }
      `}</style>
    </div>
  );
}

// usage:
// const [role, setRole] = useState("");

// <SearchableDropdown
//   label="Role"
//   value={role}
//   onChange={setRole}
//   options={[
//     { value: "admin", label: "Administrator" },
//     { value: "instructor", label: "Instructor" },
//     { value: "officer", label: "Officer" },
//     { value: "student", label: "Student" },
//   ]}
// />
