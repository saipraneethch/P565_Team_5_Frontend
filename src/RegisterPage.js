import React, { useState } from 'react';
import './styles/RegisterPage.css'; // You will need to create the corresponding CSS file
import { useRegister } from './hooks/useRegister'; 

const RegisterPage = ({ setRegistered }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, isLoading, error } = useRegister()

  const handleRegister = async (e) => {
    e.preventDefault();
    // Add validation and registration logic here
    await register(firstName, lastName,username, email, password)
    console.log('Register with:', firstName, lastName, email, username, password);
    // After registration logic, if successful:
    setRegistered(true);
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value) }
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button disabled={isLoading} type="submit">Register</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;

