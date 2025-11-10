import { NavLink } from "react-router-dom";

export default function ClassNavigation({ course }) {
  const neutral = "py-4 px-10";
  const active = "text-blue-950 border-b-3";

  return (
    <div className="flex w-full text-lg font-medium mt-2">
      <NavLink to={`/class/${course.id}`} end className={({ isActive }) => `${neutral} ${isActive ? active : ""}`}>
        <h2>Students</h2>
      </NavLink>

      <NavLink to={`/class/${course.id}/attendance`} end className={({ isActive }) => `${neutral} ${isActive ? active : ""}`}>
        <h2>Attendance</h2>
      </NavLink>

      <NavLink to={`/class/${course.id}/tasks`} end className={({ isActive }) => `${neutral} ${isActive ? active : ""}`}>
        <h2>Tasks</h2>
      </NavLink>

      <NavLink to={`/class/${course.id}/announcements`} end className={({ isActive }) => `${neutral} ${isActive ? active : ""}`}>
        <h2>Announcements</h2>
      </NavLink>
    </div>
  );
}