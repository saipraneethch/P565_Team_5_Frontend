import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import "./styles/App.css";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ActivateRegisterPage from "./pages/ActivateRegisterPage";
import AddCourse from "./pages/adminPages/AddCourse";

import InstructorDashboard from "./pages/instructorPages/Dashboard";
import InstructorCourses from "./pages/instructorPages/Courses";
import InstructorUsers from "./pages/instructorPages/UserDetails";

import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/topNavbar";
import SideNavbar from "./components/sideNavbar";

import AdminDashboard from "./pages/adminPages/Dashboard";
<<<<<<< HEAD
import AdminUsers from "./pages/adminPages/UserDetails";

=======
import Users from "./pages/adminPages/UserDetails";
import AddCourse from "./pages/adminPages/AddCourse";
import CourseDetails from "./pages/adminPages/CourseDetails";
>>>>>>> prithvi

const App = () => {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        {user && <SideNavbar />} {/* Only render SideNavbar if user is logged in */}
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/activateregister" element={!user ? <ActivateRegisterPage /> : <Navigate to="/" />} />
<<<<<<< HEAD


            <Route
              path="/dashboard"
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard />
                )
                  : user?.role === 'instructor' ? (
                    <InstructorDashboard />
                  )
                    // : user?.role === 'student' ? (
                    //   <StudentDashboard />
                    // ) 
                    : (
                      <Navigate to="/" />
                    )
              }
            />

            <Route
              path="/users"
              element={
                user?.role === 'admin' ? (
                  <AdminUsers />
                )
                  : user?.role === 'instructor' ? (
                    <InstructorUsers />
                  )
                    : (
                      <Navigate to="/" />
                    )
              }
            />

            <Route
              path="/courses"
              element={
                user?.role === 'admin' ? (
                  <AddCourse />
                )
                  : user?.role === 'instructor' ? (
                    <InstructorCourses />
                  )
                    : (
                      <Navigate to="/" />
                    )
              }
            />
            {/* <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} /> */}
            {/* <Route path="/admin-users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/" />} /> */}
            <Route path="/add-course" element={user?.role === 'admin' ? <AddCourse /> : <Navigate to="/" />} />



=======
            <Route path="/admin-dashboard" element={user?.role ==='admin'? <AdminDashboard /> : <Navigate to="/"/>} />
            <Route path="/admin-users" element={user?.role ==='admin'? <Users /> : <Navigate to="/" />} />
            {/* <Route path="/add-course" element={<AddCourse/>}/> */}
            <Route path="/admin-courses" element={user?.role ==='admin'? <CourseDetails /> : <Navigate to="/" />} />
            <Route path="/add-course" element={user?.role ==='admin'? <AddCourse /> : <Navigate to="/" />} />
>>>>>>> prithvi
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
