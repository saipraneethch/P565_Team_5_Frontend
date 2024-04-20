// UserEditModal.js in components folder
import React, { useState } from "react";
import "../styles/UserDetails.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthContext } from "../hooks/useAuthContext";

const UserEditModal = ({ selecteduser, closeModal,refreshUsers }) => {
  const [formData, setFormData] = useState({ ...selecteduser }); // Preset with user data
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState(null); // For displaying error messages
  const [file, setFile] = useState(null); // For handling file upload

  const { user } = useAuthContext();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // For file uploads, set the file state instead of form data
    if (name === "avatar") {
      setFile(e.target.files[0]);
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };
  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };
  const uploadFile = async (file) => {
    let resourceType = 'auto'; 
    const fileType = file.type.split('/')[0]; // 'video' or 'application' etc.
    console.log("FileType:",fileType)

    if (fileType === 'image') {
        resourceType = 'image';
    } else if (['application', 'text'].includes(fileType)) {
        resourceType = 'auto';
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', fileType === 'image' ? 'images_preset' : 'ppt_preset');

    const cloudName = 'dujhzpily';
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const response = await fetch(api, {
      method: 'POST',
      body: data
    });
    console.log("Response url: ",response)

    if (response.ok) {
        const jsonResponse = await response.json();
        
        return jsonResponse.url; // Assuming the response contains the URL of the uploaded file
      } else {
        // Handle errors here
        const errorResponse = await response.json();
        throw new Error(errorResponse.error.message);
      }
    };

  const handleSaveChanges = async () => {
    try {
      // Check if the username exists
      console.log(user)
      let adminUsername=user.username
      
      if (formData.username !== selecteduser.username) {
      const checkUsernameResponse = await fetch(
        `/api/v1/userdetails/check-username/${encodeURIComponent(formData.username)}`
      );

      if (!checkUsernameResponse.ok) {
        const result = await checkUsernameResponse.json();
        throw new Error(result.message || "Username check failed.");
      }
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

     
// Upload file and get the file URL
let fileUrl = formData.avatar; // Default to existing avatar URL
    if (file) {
      fileUrl = await uploadFile(file);
    }

// Update the form data with the file URL if file is uploaded
const updatedFormData = fileUrl ? { ...formData, avatar: fileUrl } : formData;


      // Update user details
      const updateResponse = await fetch(`/api/v1/userdetails/${selecteduser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || "Update failed.");
      }

      toast.success('User details updated successfully');
      // If successful, close the modal
      closeModal();
      refreshUsers(); 

    } catch (error) {
      toast.error(error.message || 'Failed to update user details');
      setError(error.message);
    }
  };

  

  return (
    <div className="modal">
      <div className="modal-popup">
        <div className="edit-user-modal-content">
          <span
            className="material-symbols-outlined close-button"
            onClick={closeModal}
          >
            &#10005;
          </span>

          <h4>User Details</h4>
          {/* Display error message if any */}
          {error && <p className="error" >{error}</p>}

          {/* Form fields for user details */}
          <label htmlFor="firstName">First Name: </label>
          <input
            id = 'firstName'
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
          <label htmlFor="lastName">Last Name: </label>
          <input
            id = "lastName"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
          />
          <label htmlFor="username">Username: </label>
          <input
            id = 'username'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
          />
          <div className="edit-user-label">
          <label htmlFor="role">Role: </label>
          <select name="role" value={formData.role} onChange={handleFormChange}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          </div>

          {/* Image upload field */}
          
          <label>Upload Image: </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFormChange}
          />

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
