import { Routes, Route, Navigate, useLocation, Link  } from "react-router-dom";
import ErrorRoute from "./ErrorRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PrivateRoute from "./PrivateRoute";
import AnnouncementPage from "@/pages/AnnouncementPage";
import ProgramsPage from "@/pages/ProgramsPage";
import CalendarPage from "@/pages/CalendarPage";
import UsersPage from "@/pages/UsersPage";
import CreateUserPage from "@/pages/CreateUserPage";
import EditUserPage from "@/pages/EditUserPage";
import HelpPage from "@/pages/HelpPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationPage from "@/pages/NotificationPage";
import ClassroomPage from "@/pages/ClassroomPage";
import CoursePage from "@/pages/CoursePage";
import ClassPage from "@/pages/ClassPage";
import ClassesPage from "@/pages/ClassesPage";
import Layout from "@/components/layout/Layout";
import CoursesPage from "@/pages/CoursesPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/announcements" element={<AnnouncementPage />} />

        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/classrooms/:id" element={<ClassroomPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/course" element={<CoursesPage />} />

        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/class/:classCourseId/:date?" element={<ClassPage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/create" element={<CreateUserPage />} />
        <Route path="/users/:id" element={<EditUserPage />} />

        <Route path="/help" element={<HelpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>

      {/* Custom error routes */}
      <Route path="*" element={<ErrorRoute code={404} />} />
      <Route path="/401" element={<ErrorRoute code={401} />} />
      <Route path="/403" element={<ErrorRoute code={403} />} />
      <Route path="/500" element={<ErrorRoute code={500} />} />
    </Routes>
  );
}
