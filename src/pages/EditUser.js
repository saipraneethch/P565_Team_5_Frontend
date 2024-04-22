import React, { useEffect, useState } from "react";
import "../styles/App.css";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

import defaultAvatar from "../default_pic.jpg";

const EditUser = () => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState(null); // For handling file upload

  const [error, setError] = useState(null); // For displaying error messages

  const uploadFile = async (file) => {
    let resourceType = "auto";
    const fileType = file.type.split("/")[0]; // 'video' or 'application' etc.
    console.log("FileType:", fileType);

    if (fileType === "image") {
      resourceType = "image";
    } else if (["application", "text"].includes(fileType)) {
      resourceType = "auto";
    }

    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      fileType === "image" ? "images_preset" : "ppt_preset"
    );

    const cloudName = "dujhzpily";
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(api, {
      method: "POST",
      body: data,
    });
    console.log("Response url: ", response);

    if (response.ok) {
      const jsonResponse = await response.json();

      return jsonResponse.url; // Assuming the response contains the URL of the uploaded file
    } else {
      // Handle errors here
      const errorResponse = await response.json();
      throw new Error(errorResponse.error.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      // console.log("controller test print ", user.username);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails/username/${user.username}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("User details not found.");
      }
      const userdetail = await res.json();
      setFormData({
        first_name: userdetail.first_name,
        last_name: userdetail.last_name,
        username: userdetail.username,
        avatar: userdetail.avatar,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
    // eslint-disable-next-line
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // For file uploads, set the file state instead of form data
    if (name === "avatar") {
      setFile(e.target.files[0]);
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Upload file and get the file URL
      let fileUrl = formData.avatar; // Default to existing avatar URL
      if (file) {
        fileUrl = await uploadFile(file);
      }

      // Update the form data with the file URL if file is uploaded
      const updatedFormData = fileUrl
        ? { ...formData, avatar: fileUrl }
        : { ...formData }; // Exclude confirmPassword field
      delete updatedFormData.confirmPassword; // Remove confirmPassword field

      // Update user details
      const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails/${user._id}`, {
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
      toast.success("User updated successfully!");
      fetchUserDetails();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="edit-user">
      <div className="edit-user-container">
        <div className="edit-user-content">
          <h4>Edit Profile Information</h4>
          {error && <p className="error">{error}</p>}

          <div className="user-pic">
            <img src={formData.avatar || defaultAvatar} alt="Profile" />
          </div>

          {/* Form fields for user details */}
          <label htmlFor="firstName">First Name: </label>
          <input
            id="firstName"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
          <label htmlFor="lastName">Last Name: </label>
          <input
            id="lastName"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
          />
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
          />

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleFormChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleFormChange}
          />

          {/* Image upload field */}
          <label>Upload Image: </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFormChange}
          />

          <button type="button" onClick={handleSaveChanges}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
