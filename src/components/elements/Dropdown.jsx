import { useState, useRef, useEffect } from "react";

export function FloatingLabelDropdown({
  label = "Select",
  name,            
  value,
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const isFilled = value !== "" && value !== null && value !== undefined;

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || "";

  return (
    <div className="relative h-full w-full" ref={wrapperRef}>
      {/* Hidden input so this dropdown becomes part of POST request */}
      <input type="hidden" name={name} value={value ?? ""} />

      {/* Floating Label */}
      <label
        className={` absolute left-3 pointer-events-none bg-white transition-all duration-200 px-1.5
          ${
            isFilled
              ? open
                ? "-top-2 text-sm text-blue-400"
                : "-top-2 text-sm text-gray-500"
              : open
              ? "-top-2 text-sm text-blue-400"
              : "top-3.5 text-gray-400 text-base"
          }`}
      >
        {label}
      </label>

      {/* Select Box (custom UI) */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={`
          flex w-full h-full border rounded-xl bg-white px-4 items-center cursor-pointer select-none
          transition-all duration-150
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
        `}
      >
        <div
          className={`text-base ${
            isFilled ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {isFilled ? selectedLabel : ""}
        </div>

        {/* Arrow Icon */}
        <svg
          className={`
            w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-500 transition-transform duration-150
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
        <ul
          className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-20 max-h-45 overflow-auto animate-slide-down"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-colors
                hover:bg-gray-100 
                ${opt.value === value ? "bg-blue-50 text-blue-600" : "text-gray-800"}
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

export function Dropdown({
  label = "Select",
  value,
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || label;

  return (
    <div className="relative h-full w-full" ref={wrapperRef}>
      {/* Display Box */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={`h-full border rounded-lg px-4 py-3 cursor-pointer bg-white
          text-gray-800 select-none flex justify-between items-center
          transition-all duration-150
          hover:bg-zinc-50
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
        `}
      >
        <span className={`${value ? "" : "text-gray-400"}`}>
          {selectedLabel}
        </span>

        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
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

      {/* Dropdown Menu */}
      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-20 max-h-60 overflow-auto 
                     animate-slide-down"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-colors
                hover:bg-gray-100 
                ${
                  opt.value === value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-800"
                }
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

// usage:

// <FloatingLabelDropdown
//   label="User Role"
//   value={role}
//   onChange={setRole}
//   options={[
//     { value: "admin", label: "Admin" },
//     { value: "teacher", label: "Teacher" },
//     { value: "student", label: "Student" },
//   ]}
// />