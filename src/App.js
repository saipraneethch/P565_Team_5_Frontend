import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const {user} = useAuthContext()

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setRegistered={setIsRegistered} />} />
          <Route path="/" element={isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
