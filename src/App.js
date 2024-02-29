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
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isRegistered, setIsRegistered] = useState(false);

  const { user } = useAuthContext();

  return (
    
    <div className="App">
      <BrowserRouter>
      <SideNavbar/>
        <Navbar />
        
        <div className="pages">
        
          <Routes>
            <Route
              path="/"
              //element={user?.user?.role === "student" ?  <HomePage />  : <Navigate to="/login" /> }
              element={user? <HomePage /> : <Navigate to="/login"/>}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path="/activateregister"
              element={!user ? <ActivateRegisterPage /> : <Navigate to="/" />}
            />
            <Route
              path="/admin-dashboard"
              //element={ <AdminDashboard />}
              element={user? <AdminDashboard /> : <Navigate to= "/"/> }
              //element={user.user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login"/>}
            />
            <Route
              path="/admin-users"
              element={<Users />}
              //element={user ? <Users /> : <Navigate to = "/" />}
            />

              <Route
              path="/add-course"
              element={<AddCourse />}
              //element={user ? <Users /> : <Navigate to = "/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
   
  );
};

export default App;
