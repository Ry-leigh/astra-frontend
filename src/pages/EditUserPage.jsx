import api from "../api/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/components/elements/PageHeader";
import TextInput from "@/components/elements/TextInput";
import { FloatingLabelDropdown } from "@/components/elements/Dropdown";
import ErrorRoute from "@/router/ErrorRoute";

function capitalizeWords(str) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function EditUserPage() {
  const { id } = useParams();
    const navigate = useNavigate();


  // ------------------------------
  // Form state
  // ------------------------------
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // optional
  const [userRole, setUserRole] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");

  // ------------------------------
  // Options
  // ------------------------------
  const [programOptions, setProgramOptions] = useState([]);
  const [yearLevelOptions, setYearLevelOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleMapping = {
    administrator: 1,
    instructor: 2,
    officer: 3,
    student: 4,
  };

  const roleReverse = {
    1: "administrator",
    2: "instructor",
    3: "officer",
    4: "student",
  };

  function formatYearLabel(year) {
    const suffix =
      year === 1
        ? "1st"
        : year === 2
        ? "2nd"
        : year === 3
        ? "3rd"
        : `${year}th`;
    return `${suffix} Year`;
  }

  // ------------------------------------------------------
  // Fetch backend options (programs, classrooms)
  // ------------------------------------------------------
  const fetchEditData = async () => {
    try {
      const userResponse = await api.get(`/users/${id}`);
      if (!userResponse.data.success) throw new Error();
      const user = userResponse.data.user;

      const response = await api.get(`/user/create`);
      if (!response.data.success) throw new Error();

      console.log(userResponse.data)
      // Set initial form values
      setFirstName(user.first_name);
      setMiddleName(user.middle_name ?? "");
      setLastName(user.last_name);
      setSex(user.sex ?? "");
      setAddress(user.address);
      setEmail(user.email);
      setUserRole(roleReverse[user.roles[0].id]);

      // For instructors
      if (user.instructor) {
        setProgram(user.instructor.program_id);
      }

      // For students / officers
      if (user.student) {
        setProgram(user.student.program_id);
        setYearLevel(user.student.year_level);
        setSection(user.student.section ?? null);
      }

      // Set program options
      const formattedPrograms = response.data.programs.map((p) => ({
        value: p.id,
        label: p.name,
      }));

      setProgramOptions([{ value: null, label: "N/A" }, ...formattedPrograms]);

      setClassrooms(response.data.classrooms);
    } catch (error) {
      console.error(error);
      setError(error?.response?.status || 404);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEditData();
  }, []);

  // ------------------------------------------------------
  // Filter Year Levels when Program changes
  // ------------------------------------------------------
  useEffect(() => {
    if (!program) {
      setYearLevelOptions([]);
      return;
    }

    const filtered = classrooms.filter((c) => c.program_id === program);

    const years = [...new Set(filtered.map((c) => c.year_level))];

    const formatted = years.map((y) => ({
      value: y,
      label: formatYearLabel(y),
    }));

    setYearLevelOptions(formatted);
  }, [program, classrooms]);

  // ------------------------------------------------------
  // Filter Sections when Year Level changes
  // ------------------------------------------------------
  useEffect(() => {
    if (!program || !yearLevel) {
      setSectionOptions([]);
      return;
    }

    const filtered = classrooms.filter(
      (c) => c.program_id === program && c.year_level === yearLevel
    );

    const sections = [...new Set(filtered.map((c) => c.section || "N/A"))];

    const formatted = sections.map((s) => ({
      value: s === "N/A" ? null : s,
      label: s === "N/A" ? "N/A" : s,
    }));

    setSectionOptions(formatted);
  }, [program, yearLevel, classrooms]);

  // ------------------------------------------------------
  // Submit update request
  // ------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/users/${id}`, {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        sex,
        address,
        email,
        password: password || null,
        password_confirmation: password || null,
        role_id: roleMapping[userRole],
        program_id: program || null,
        year_level: yearLevel || null,
        section: section || null,
      });

      console.log("User updated:", response.data);
      // You can add toast + redirect here
      navigate("/users");
    } catch (error) {
      console.error("Update failed:", error.response?.data);
    }

  };

  if (loading)
    return (
      <>
        <PageHeader title="Edit User" />
        <div className="flex flex-col h-full bg-white rounded-xl p-6 pt-8 gap-6" />
      </>
    );

  if (error) return <ErrorRoute code={error} />;

  return (
    <>
      <div className="flex flex-col w-full h-full gap-4">
        <PageHeader title="Edit User" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full bg-white rounded-xl p-6 pt-8 gap-6"
        >
          <div className="flex gap-4">
            <TextInput
              name="first_name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
            />

            <TextInput
              name="middle_name"
              label="Middle Name"
              value={middleName}
              onChange={(e) =>
                setMiddleName(capitalizeWords(e.target.value))
              }
            />

            <TextInput
              name="last_name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(capitalizeWords(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
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

            <TextInput
              name="address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <TextInput
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextInput
              name="password"
              label="New Password (optional)"
              value={password}
              type="text"
              onChange={(e) => setPassword(e.target.value)}
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
            onChange={setUserRole}
            options={[
              { value: "administrator", label: "Admin" },
              { value: "instructor", label: "Instructor" },
              { value: "officer", label: "Class Officer" },
              { value: "student", label: "Student" },
            ]}
          />
            </div >
        </div>

          {(userRole === "student" || userRole === "officer") && (
            <div className="flex h-13 gap-4">
            <div className="flex w-15/20">
              <FloatingLabelDropdown
                name="program_id"
                label="Program"
                value={program}
                onChange={(v) => {
                  setProgram(v);
                  setYearLevel("");
                  setSection("");
                }}
                options={programOptions}
              />
              </div>
<div className="flex w-3/20">
              <FloatingLabelDropdown
                name="year_level"
                label="Year Level"
                value={yearLevel}
                onChange={(v) => {
                  setYearLevel(v);
                  setSection("");
                }}
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

          {userRole === "instructor" && (
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

          <button
            type="submit"
            className="flex h-fit w-fit px-4 py-2 rounded-md gap-2 items-center bg-blue-500 text-white text-base font-medium cursor-pointer hover:bg-blue-600 hover:shadow-md/20"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
