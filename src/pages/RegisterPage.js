import React, { useState } from "react";
import "../styles/RegisterPage.css"; // You will need to create the corresponding CSS file
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ setRegistered }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const { register, isLoading, error , resetError} = useRegister();

  const handleRegister = async (e) => {
    e.preventDefault();
    resetError(); // Reset any existing registration errors
    setFormError(""); // Reset form error state
    

    // Check if passwords match
    if (password !== confirmPassword) {
      // Update the UI to inform the user that the passwords do not match
      // This could be setting an error state that is displayed to the user
      setFormError("Passwords do not match");
      return; // Prevent the registration function from being called
    }
    const success = await register(
      firstName,
      lastName,
      username,
      email,
      password
    );
    console.log(success)
    if (success) {
      // Navigate only if registration was successful
      navigate("/activateregister");
    } else {
      // Handle error, e.g., show a message to the user
      console.error(error); // Or use a more user-friendly way to show the error
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
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
          onChange={(e) => setEmail(e.target.value)}
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
        <button disabled={isLoading} type="submit">
          Register
        </button>
        {formError && <div className="error">{formError}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
