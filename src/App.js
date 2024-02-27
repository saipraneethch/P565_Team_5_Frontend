import React from 'react';
import { BrowserRouter , Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ActivateRegisterPage from './pages/ActivateRegisterPage';
import { useAuthContext } from './hooks/useAuthContext';

import Navbar from './componenets/topNavbar';

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isRegistered, setIsRegistered] = useState(false);

  const {user} = useAuthContext()
  

  // return (
    
  //     <div className="App">
  //       <BrowserRouter>
  //     <Navbar />
  //       <Routes>
  //         <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
  //         <Route path="/register" element={<RegisterPage setRegistered={setIsRegistered} />} />
  //         <Route path="/" element={isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
  //       </Routes>
  //     </div>
  //   </BrowserRouter>
  // );

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/login"/>}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to='/'/>}
            />
            <Route
              path="/register"
              element={!user? <RegisterPage /> : <Navigate to='/'/>}
            />
            <Route
              path="/activateregister"
              element={!user? <ActivateRegisterPage /> : <Navigate to='/'/>}
            />
          </Routes>
          
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
