import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import HelpPage from "@/pages/HelpPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationPage from "@/pages/NotificationPage";
import ClassroomPage from "@/pages/ClassroomPage";
import CoursePage from "@/pages/CoursePage";
import ClassPage from "@/pages/ClassPage";
import ClassesPage from "@/pages/ClassesPage";
import Layout from "@/components/layout/Layout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route path="/dashboard" element={<PrivateRoute> <DashboardPage /> </PrivateRoute>}/>
      <Route path="/calendar" element={<PrivateRoute> <CalendarPage /> </PrivateRoute>}/>
      <Route path="/announcements" element={<PrivateRoute> <AnnouncementPage /> </PrivateRoute>}/>
      
      <Route path="/programs" element={<PrivateRoute> <ProgramsPage /> </PrivateRoute>}/>
      <Route path="/classrooms/:id" element={<PrivateRoute> <ClassroomPage /> </PrivateRoute>}/>
      <Route path="/courses/:id" element={<PrivateRoute> <CoursePage /> </PrivateRoute>}/>

      <Route path="/classes" element={<PrivateRoute> <ClassesPage /> </PrivateRoute>}/>
      <Route path="/class/:classCourseId/:date?" element={<PrivateRoute> <Layout><ClassPage /></Layout> </PrivateRoute>}/>

      <Route path="/users" element={<PrivateRoute> <UsersPage /> </PrivateRoute>}/>
      <Route path="/help" element={<PrivateRoute> <HelpPage /> </PrivateRoute>}/>
      <Route path="/settings" element={<PrivateRoute> <SettingsPage /> </PrivateRoute>}/>
      <Route path="/profile" element={<PrivateRoute> <ProfilePage /> </PrivateRoute>}/>
      <Route path="/notifications" element={<PrivateRoute> <NotificationPage /> </PrivateRoute>}/>

      {/* Custom error routes */}
      <Route path="*" element={<ErrorRoute code={404} />} />
      <Route path="/401" element={<ErrorRoute code={401} />} />
      <Route path="/403" element={<ErrorRoute code={403} />} />
      <Route path="/500" element={<ErrorRoute code={500} />} />
    </Routes>
  );
}