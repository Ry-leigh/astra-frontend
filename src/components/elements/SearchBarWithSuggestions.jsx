import { useState, useRef, useEffect } from "react";

export default function SearchBarWithSuggestions({
  label = "Search",
  value,
  onChange,
  suggestions = [],
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef(null);

  const isFilled = value?.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0) {
        const selected = suggestions[highlighted];
        onSelect(selected);
        setOpen(false);
      }
    }
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Floating Label */}
      <label
        className={`
          absolute left-3 bg-white px-1 pointer-events-none transition-all duration-200
          ${isFilled ? "-top-2 text-sm text-gray-600" : "top-3.5 text-base text-gray-400"}
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600
        `}
      >
        {label}
      </label>

      {/* Search Input */}
      <input
        value={value}
        placeholder=" "
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="
          peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white
          text-base text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-transparent
          focus:outline-none
        "
      />

      {/* Suggestions */}
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
          {suggestions.map((item, index) => (
            <li
              key={item.value ?? item.id ?? item}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`
                px-4 py-2 cursor-pointer transition-colors
                ${index === highlighted ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}
              `}
            >
              {item.label ?? item.name ?? item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// usage:

// const [search, setSearch] = useState("");

// <SearchBarWithSuggestions
//   label="Search User"
//   value={search}
//   onChange={setSearch}
//   suggestions={[
//     { value: 1, label: "Haerin" },
//     { value: 2, label: "Minji" },
//     { value: 3, label: "Hanni" },
//     { value: 4, label: "Dani" },
//     { value: 5, label: "Hyein" },
//   ]}
//   onSelect={(item) => console.log("Selected:", item)}
// />
