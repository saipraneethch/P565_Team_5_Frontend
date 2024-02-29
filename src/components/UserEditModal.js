// UserEditModal.js in components folder
import React, { useState } from "react";
import "../styles/UserDetails.css";

const UserEditModal = ({ user, closeModal }) => {
  const [formData, setFormData] = useState({ ...user }); // Preset with user data
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState(null); // For displaying error messages

  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      // Check if the username exists
      let adminUsername=user.username
      
      const checkUsernameResponse = await fetch(
        `/api/v1/userdetails/check-username/${encodeURIComponent(formData.username)}`
      );

      if (!checkUsernameResponse.ok) {
        const result = await checkUsernameResponse.json();
        throw new Error(result.message || "Username check failed.");
      }

      // Verify admin password
      
      const verifyPasswordResponse = await fetch("/api/v1/userdetails/verify-admin", {
        method: "POST",
        body: JSON.stringify({ username: adminUsername ,password: adminPassword }),
        headers: {
          "Content-Type": "application/json",
        },
        
      });

      if (!verifyPasswordResponse.ok) {
        const result = await verifyPasswordResponse.json();
        throw new Error(result.message || "Admin password verification failed.");
      }

      // Update user details
      const updateResponse = await fetch(`/api/v1/userdetails/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || "Update failed.");
      }

      // If successful, close the modal
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-popup">
        <div className="modal-content">
          <span
            className="material-symbols-outlined close-button"
            onClick={closeModal}
          >
            &#10005;
          </span>

          <h4>User Details</h4>
          {/* Display error message if any */}
          {error && <p className="error">{error}</p>}

          {/* Form fields for user details */}
          <label>First Name: </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleFormChange}
          />
          <label>Last Name: </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFormChange}
          />
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
          />
          <label>Role: </label>
          <select name="role" value={formData.role} onChange={handleFormChange}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <label>Enter your password: </label>
          <input
            type="password"
            value={adminPassword}
            onChange={handleAdminPasswordChange}
          />

          <button type="button" onClick={handleSaveChanges}>
            Save
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
