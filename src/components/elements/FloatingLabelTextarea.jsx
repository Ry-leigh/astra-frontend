import { useRef, useEffect } from "react";

export default function FloatingLabelTextarea({
  label = "Description",
  value,
  onChange,
  name = "",
  rows = 4,
  autoResize = true,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value, autoResize]);

  const isFilled = value && value.length > 0;

  return (
    <div className="relative w-full">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`
          peer w-full resize-none rounded-xl border border-gray-300 bg-white
          px-4 py-3 text-base text-gray-800 transition-all duration-150
          focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:outline-none
        `}
      />

      {/* Floating Label */}
      <label
        className={`
          absolute left-3 pointer-events-none bg-white px-1 transition-all duration-200
          ${isFilled
            ? "-top-2 text-sm text-gray-500"
            : "top-3.5 text-gray-400 text-base"}
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400
        `}
      >
        {label}
      </label>
    </div>
  );
}
