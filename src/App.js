import React, { useState } from 'react';
import './styles/App.css'; // Import CSS for styling
import LoginPage from './LoginPage'; // Import the LoginPage component
import HomePage from './HomePage'; // Import the HomePage component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
};

export default App;
