import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "./styles/App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ActivateRegisterPage from "./pages/ActivateRegisterPage";
import AddCourse from "./pages/adminPages/AddCourse";

import InstructorDashboard from "./pages/instructorPages/Dashboard";

import InstructorUsers from "./pages/instructorPages/UserDetails";

import StudentDashboard from "./pages/studentPages/Dashboard";
import StudentCourses from "./pages/studentPages/Courses";
import StudentGrades from "./pages/studentPages/Grades";
import Chat from "./pages/Chat";

import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/topNavbar";
import SideNavbar from "./components/sideNavbar";

import AdminDashboard from "./pages/adminPages/Dashboard";
import AdminUsers from "./pages/adminPages/UserDetails";
import ViewUser from "./pages/adminPages/ViewUser";

// import AddCourse from "./pages/adminPages/AddCourse";
import CourseDetails from "./pages/adminPages/CourseDetails";
import ViewCourse from "./pages/adminPages/ViewCourse";

import EnrollCourse from "./pages/studentPages/EnrollCourse";
import EnrolledCourses from "./pages/studentPages/EnrolledCourses";
import DropCourse from "./pages/studentPages/DropCourse";

import AssignedCourses from "./pages/instructorPages/Courses";
import Assignments from "./pages/instructorPages/Assignments";
import CreateAssignment from "./pages/instructorPages/CreateAssignment";

import UploadContent from "./pages/instructorPages/UploadModules";

const App = () => {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        {user && <SideNavbar />}{" "}
        {/* Only render SideNavbar if user is logged in */}
        <Navbar />
        <div className="pages">
          <ToastContainer position="top-center" style={{ marginTop: "50px" }} />
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/activateregister" element={!user ? <ActivateRegisterPage /> : <Navigate to="/" />} />
            <Route path="/chat" element={ <Chat /> } />

            <Route
              path="/dashboard"
              element={
                user?.role === "admin" ? (
                  <AdminDashboard />
                ) : user?.role === "instructor" ? (
                  <InstructorDashboard />
                ) : user?.role === "student" ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/users"
              element={
                user?.role === "admin" ? (
                  <AdminUsers />
                ) : user?.role === "instructor" ? (
                  <InstructorUsers />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/grades"
              element={
                user?.role === "student" ? (
                  <StudentGrades />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/courses"
              element={
                user?.role === "admin" ? (
                  <CourseDetails />
                ) : user?.role === "instructor" ? (
                  <AssignedCourses />
                ) : user?.role === "student" ? (
                  <StudentCourses />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin-courses"
              element={
                user?.role === "admin" ? <CourseDetails /> : <Navigate to="/" />
              }
            />
            {/* <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} /> */}
            {/* <Route path="/admin-users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/" />} /> */}
            <Route
              path="/add-course"
              element={
                user?.role === "admin" ? <AddCourse /> : <Navigate to="/" />
              }
            />
            <Route
              path="/viewuser/:userId"
              element={
                user?.role === "admin" ? <ViewUser /> : <Navigate to="/" />
              }
            />
            <Route
              path="/courses/view/:courseId"
              element={
                user?.role === "admin" ? <ViewCourse /> : <Navigate to="/" />
              }
            />

            <Route
              path="/enroll-new-course"
              element={
                user?.role === "student" ? (
                  <EnrollCourse />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/enrolled-courses"
              element={
                user?.role === "student" ? (
                  <EnrolledCourses />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/drop-course"
              element={
                user?.role === "student" ? <DropCourse /> : <Navigate to="/" />
              }
            />

            <Route
              path="/selected-course-assignments/:course_id/:instructor_id/:course_code"
              element={
                user?.role === "instructor" ? (
                  <Assignments />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/create-assignment/:course_id/:instructor_id/:course_code"
              element={
                user?.role === "instructor" ? (
                  <CreateAssignment />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

<Route
              path="/upload-content/:course_id"
              element={
                user?.role === "instructor" ? (
                  <UploadContent />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
