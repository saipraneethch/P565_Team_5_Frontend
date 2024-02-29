import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ActivateRegisterPage from "./pages/ActivateRegisterPage";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/topNavbar";
import SideNavbar from "./components/sideNavbar";

import AdminDashboard from "./pages/adminPages/Dashboard";
import Users from "./pages/adminPages/UserDetails";
import AddCourse from "./pages/adminPages/AddCourse";

const App = () => {
  const { user } = useAuthContext();
 

  return (
    <div className="App">
      <BrowserRouter>
        {user && user.role ==='admin'&& <SideNavbar />} {/* Only render SideNavbar if user is logged in */}
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login"/>} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/activateregister" element={!user ? <ActivateRegisterPage /> : <Navigate to="/" />} />
            <Route path="/admin-dashboard" element={user?.role ==='admin'? <AdminDashboard /> : <Navigate to="/"/>} />
            <Route path="/admin-users" element={user?.role ==='admin'? <Users /> : <Navigate to="/" />} />
            <Route path="/add-course" element={user?.role ==='admin'? <AddCourse /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
