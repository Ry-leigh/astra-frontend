import api from "../api/axios"
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/elements/PageHeader";
import TextInput from "@/components/elements/TextInput";
import { FloatingLabelDropdown } from "@/components/elements/Dropdown";
import ErrorRoute from "@/router/ErrorRoute"; 

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMIddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(`astra#${dayjs().format("ssmmDD")}`);
  const [userRole, setUserRole] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");
  const [programOptions, setProgramOptions] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [yearLevelOptions, setYearLevelOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users", {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        sex,
        address,
        email,
        password,
        password_confirmation: password,
        role_id: roleMapping[userRole] ?? null,
        program_id: program || null,
        year_level: yearLevel || null,
        section: section || null,
      });

      console.log("User created:", response.data);
      // show toast, redirect, etc
      navigate("/users");
    } catch (error) {
      console.error("Failed:", error.response?.data);
    }
  };

  const fetchCreateData = async () => {
    try {
      const response = await api.get('/user/create');
      console.log(response.data);
      if(response.data.success) {
        const formattedPrograms = response.data.programs.map(program => ({
          value: program.id,
          label: program.name
        }));
        setProgramOptions(formattedPrograms);
        formattedPrograms.unshift({ value: null, label: "N/A" });
        
        setClassrooms(response.data.classrooms)
      } else {
        throw new Error("Failed to load field data")
      }
    } catch (error) {
      console.error("Error fetching class:", error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreateData();
  }, [])

  useEffect(() => {
    if (!program) {
      setYearLevelOptions([]);
      return;
    }

    const filtered = classrooms.filter(c => c.program_id === program);

    const yearLevels = [...new Set(filtered.map(c => c.year_level))];

    const formatted = yearLevels.map(y => ({
      value: y,
      label: formatYearLabel(y)
    }));

    // formatted.unshift({ value: null, label: "N/A" });

    setYearLevelOptions(formatted);

  }, [program, classrooms]);

  const roleMapping = {
    administrator: 1,
    instructor: 2,
    officer: 3,
    student: 4
  };

  function formatYearLabel(year) {
    const suffix = 
      year === 1 ? "1st" :
      year === 2 ? "2nd" :
      year === 3 ? "3rd" :
      `${year}th`;

    return `${suffix} Year`;
  }

  useEffect(() => {
    if (!program || !yearLevel) {
      setSectionOptions([]);
      return;
    }

    const filtered = classrooms.filter(
      c => c.program_id === program && c.year_level === yearLevel
    );

    const sections = [...new Set(filtered.map(c => c.section || "N/A"))];

    const formatted = sections.map(section => ({
      value: section === "N/A" ? null : section,
      label: section === "N/A" ? "N/A" : section
  }));

  // formatted.unshift({ value: null, label: "N/A" });

    setSectionOptions(formatted);

  }, [program, yearLevel, classrooms]);

  if (loading) return (
    <Layout>
      <PageHeader title="Create User"/>
        <div className="flex flex-col h-full bg-white rounded-xl p-6 pt-8 gap-6"/>
    </Layout>
  )

  if (error) return <ErrorRoute code={error} />;

  return (
    <Layout>
      <div className="flex flex-col w-full h-full gap-4">
        <PageHeader title="Create User"/>
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-xl p-6 pt-8 gap-6">
          {/* Autofill decoys */}
          <input 
            type="text" 
            name="fake-email" 
            autoComplete="email" 
            className="hidden" 
          />

          <input 
            type="password" 
            name="fake-password" 
            autoComplete="new-password" 
            className="hidden" 
          />

          <div className="flex gap-4">
            <TextInput
              name="first_name"
              label="First Name"
              value={firstName}
              onChange={(e) => { const newFirst = capitalizeWords(e.target.value); setFirstName(newFirst); setEmail(`${newFirst}${lastName}`.toLowerCase().replace(/\s+/g, "") + `@${userRole == "student" || userRole == "officer"? 'student.' : ''}laverdad.edu.ph`) }}
              autoCapitalize="words"
            />
            
            <TextInput
              name="middle_name"
              label="Middle Name"
              value={middleName}
              type="text"
              onChange={(e) => { const newMiddle = capitalizeWords(e.target.value); setMIddleName(newMiddle) }}
              autoCapitalize="words"
            />

            <TextInput
              name="last_name"
              label="Last Name"
              value={lastName}
              onChange={(e) => { const newLast = capitalizeWords(e.target.value); setLastName(newLast); setEmail(`${firstName}${newLast}`.toLowerCase().replace(/\s+/g, "") + `@${userRole == "student" || userRole == "officer"? 'student.' : ''}laverdad.edu.ph`) }}
              autoCapitalize="words"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex xs:w-1/3 sm:w-1/4 md:w-1/4 lg:w-1/6 xl:w-1/9">
              <FloatingLabelDropdown
                name="sex"
                label="Sex"
                value={sex}
                onChange={setSex}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                ]}
              />
            </div>

            <TextInput
              name="address"
              label="Address"
              value={address}
              type="text"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <TextInput
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
              autoCapitalize="words"
            />
            
            <TextInput
              name="password"
              label="Password"
              value={password}
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <input
              type="hidden"
              name="password_confirmation"
              value={password}
            />
          </div>

          <div className="flex h-13 w-full gap-4">
            <div className="flex h-full w-1/7">
              <FloatingLabelDropdown
                name="role_id"
                label="Role"
                value={userRole}
                onChange={(value) => {
                  setUserRole(value);
                  setEmail(
                    `${firstName}${lastName}`
                      .toLowerCase()
                      .replace(/\s+/g, "") +
                      `@${value === "student" || value === "officer" ? "student." : ""}laverdad.edu.ph`
                  );
                }}
                options={[
                  { value: "administrator", label: "Admin" },
                  { value: "instructor", label: "Instructor" },
                  { value: "officer", label: "Class Officer" },
                  { value: "student", label: "Student" },
                ]}
              />
            </div >
          </div>
          
          {(userRole == "student" || userRole == "officer") && (
            <div className="flex h-13 gap-4">
              {/* change the options to the values from the backend API, values as the id and label as the names */}
                <div className="flex w-15/20">
                  <FloatingLabelDropdown
                    name="program_id"
                    label="Program"
                    value={program}
                    onChange={(value) => {setProgram(value); setYearLevel(""); setSection("")}}
                    options={programOptions}
                  />
                </div>
                <div className="flex w-3/20">
                  <FloatingLabelDropdown
                    name="year_level"
                    label="Year Level"
                    value={yearLevel}
                    onChange={(value) => {setYearLevel(value); setSection("")}}
                    options={yearLevelOptions}
                  />
                </div>
                <div className="flex w-2/20">
                  <FloatingLabelDropdown
                    name="section"
                    label="Section"
                    value={section}
                    onChange={setSection}
                    options={sectionOptions}
                  />
                </div>
            </div>
          )}

          {(userRole == "instructor") && (
            <div className="flex h-13 gap-4">
              <FloatingLabelDropdown
                name="program_id"
                label="Program"
                value={program}
                onChange={setProgram}
                options={programOptions}
              />
            </div>
          )}

          <button type="submit" className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-400 text-white text-base font-medium cursor-pointer hover:bg-blue-500 hover:shadow-md/20">
            Create User
          </button>
        </form>
      </div>
    </Layout>
  );
}
