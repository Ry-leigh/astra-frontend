import { useState, useEffect, useRef } from "react";

export default function ColorPicker({
  label = "Color",
  value = "#000000",
  onChange,
  presetColors = [
    "#EC6A5E", "#FFC068", "#FACC15", "#4ADE80",
    "#2DD4BF", "#3B82F6", "#8B5CF6", "#EC4899",
    "#6B7280", "#000000", "#FFFFFF"
  ]
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const isFilled = Boolean(value);

  // Click-outside close
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Label */}
      <label
        className={`
          absolute left-3 px-1 bg-white pointer-events-none transition-all duration-200
          ${isFilled || open ? "-top-2 text-xs text-gray-600" : "top-3.5 text-base text-gray-400"}
        `}
      >
        {label}
      </label>

      {/* Input field */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center w-full min-h-12 px-3 py-2 border rounded-xl bg-white cursor-pointer
          transition-all duration-150 select-none
          ${open ? "border-transparent ring-2 ring-blue-300" : "border-gray-300"}
        `}
      >
        {/* Preview circle */}
        <div
          className="w-6 h-6 rounded-full border mr-3"
          style={{ backgroundColor: value }}
        />

        <span className="text-gray-800">{value}</span>

        <svg
          className={`w-5 h-5 ml-auto text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Color Palette */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 bg-white border border-gray-200
            rounded-xl shadow-lg p-3 z-20 animate-dropdown
          "
        >
          {/* Preset color grid */}
          <div className="grid grid-cols-6 gap-3">
            {presetColors.map((col) => (
              <button
                key={col}
                onClick={() => {
                  onChange(col);
                  setOpen(false);
                }}
                className={`
                  w-7 h-7 rounded-full border shadow-sm transition-transform
                  ${col === value ? "ring-2 ring-blue-400 scale-110" : "hover:scale-110"}
                `}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>

          {/* Manual hex input */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer"
            />

            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="
                flex-1 px-3 py-2 border rounded-lg 
                focus:ring-2 focus:ring-blue-300 focus:outline-none
              "
            />
          </div>
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

// const [color, setColor] = useState("#3B82F6");

{/* <ColorPicker
  label="Theme Color"
  value={color}
  onChange={setColor}
/> */}
