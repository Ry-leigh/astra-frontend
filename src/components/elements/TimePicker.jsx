import React from "react";

export default function TimePicker({
  label = "Select Time",
  name,
  value,
  onChange,
  min,
  max,
  step, // optional, ex. "60" for 1-minute intervals
}) {
  const isFilled = value !== "" && value !== null && value !== undefined;

  return (
    <div className="relative w-full">
      {/* Time Input */}
      <input
        type="time"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="
          peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white
          text-base focus:border-transparent focus:ring-2 focus:ring-blue-300
          focus:outline-none
        "
      />

      {/* Floating Label */}
      <label
        className={`
          absolute left-3 pointer-events-none bg-white px-1.5
          transition-all duration-200
          ${isFilled
            ? "-top-2 text-sm text-gray-500"
            : "top-3.5 text-gray-400 text-base"
          }
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400
        `}
      >
        {label}
      </label>
    </div>
  );
}

// usage

// import { useState } from "react";
// import TimePicker from "@/components/elements/TimePicker";

// export default function Demo() {
//   const [startTime, setStartTime] = useState("");

//   return (
//     <div className="w-80 space-y-6">
//       <TimePicker
//         label="Start Time"
//         name="start_time"
//         value={startTime}
//         onChange={setStartTime}
//         step="60"  // 1-minute increments
//       />
//     </div>
//   );
// }
