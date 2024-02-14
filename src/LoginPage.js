import React, { useState } from 'react';
import './styles/LoginPage.css'; // Import CSS for styling

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Your login logic here
    console.log("Logging in with username:", username, "and password:", password);
  };

  const handleGoogleLogin = () => {
    // Google login logic
    console.log("Logging in with Google");
  };

  const handleFacebookLogin = () => {
    // Facebook login logic
    console.log("Logging in with Facebook");
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div className="social-login">
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <button onClick={handleFacebookLogin}>Login with Facebook</button>
      </div>
    </div>
  );
};

export default LoginPage;
