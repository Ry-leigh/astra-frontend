import React, { useState } from "react";

export default function DatePicker({
  label = "Select Date",
  name,
  value,
  onChange,
  min,
  max,
}) {
  const isFilled = value !== "" && value !== null && value !== undefined;

  return (
    <div className="relative w-full">
      {/* Date Input */}
      <input
        type="date"
        name={name}
        value={value}
        min={min}
        max={max}
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
          absolute left-3 pointer-events-none bg-white w-7/10 px-1.5
          transition-all duration-200
          ${isFilled 
            ? "-top-2 text-sm text-gray-500 w-fit"
            : "top-3.5 text-gray-400 text-base"
          }
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:w-fit
        `}
      >
        {label}
      </label>
    </div>
  );
}
