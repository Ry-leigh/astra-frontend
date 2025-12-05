import React from "react";

export default function TextInput({
  label,
  value,
  onChange,
  type = "text",
  name,
  autoComplete = "off",
  autoCapitalize = "none",
  placeholder = " "
}) {
  const isFilled = value;

  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        className={`
          peer w-full rounded-xl border border-gray-300 px-4 py-3.5 bg-white text-zinc-800
          text-base focus:border-transparent focus:ring-2 focus:ring-blue-300 
          focus:outline-none
        `}
      />

      <label
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none px-1.5 rounded-sm bg-white w-9/10
          ${isFilled ? "-top-2 text-sm text-gray-500 w-fit" : "top-3.5 text-base text-gray-400"}
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:w-fit
        `}
      >
        {label}
      </label>

        <style>
            {`input:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
                box-shadow: 0 0 0px 1000px #ffffff inset !important;
                -webkit-text-fill-color: #1f2937 !important;
                transition: background-color 9999s ease-out, color 9999s ease-out;
            }

            input:-webkit-autofill + label {
                top: -0.5rem !important;
                font-size: 0.875rem !important;
                color: #2563eb !important;
                background: white;
                padding: 0 4px;
            }

            input:-moz-autofill {
                box-shadow: 0 0 0 1000px #ffffff inset !important;
                -moz-text-fill-color: #1f2937 !important;
            }`}
        </style>

    </div>
  );
}

// usage:

//   const [email, setEmail] = useState("");

  // <div className="space-y-6 w-80">
  //   <TextInput
  //     label="Email"
  //     value={email}
  //     onChange={(e) => setEmail(e.target.value)}
  //   />
  //  </div>