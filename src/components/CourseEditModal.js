import React, { useState, useEffect } from "react";
import "../styles/CourseDetails.css"; // Adjust if needed
import Select from "react-select";

import { useAuthContext } from "../hooks/useAuthContext";

const CourseEditModal = ({ selectedcourse, closeModal }) => {
    const { user } = useAuthContext();

    // Adjusting initial state to handle category and instructor as objects compatible with react-select
    const [formData, setFormData] = useState({
      ...selectedcourse,
      category: selectedcourse.category.map(cat => ({ value: cat, label: cat })),
      instructor: { value: selectedcourse.instructor._id, label: selectedcourse.instructor.name } // Assuming this structure
    });
    const [adminPassword, setAdminPassword] = useState("");
    const [error, setError] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]); // Example categories, fetch these as needed
    const [instructors, setInstructors] = useState([]);
  
    useEffect(() => {
      // Example fetching instructors, replace with actual fetch logic
      setInstructors([
        // This should fetch from your API and map to { value, label }
      ]);
      // Simulating fetching category options
      setCategoryOptions([
        // Similarly fetch and map your category data
      ]);
    }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if(name === "category" || name === "instructor") return; // Skip for select handled fields
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedOptions || [],
    }));
  };

  const handleInstructorChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      instructor: selectedOption || null,
    }));
  };

  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleBibliographyChange = (index, field, value) => {
    const newBibliography = [...formData.bibliography];
    newBibliography[index][field] = value;
    setFormData({ ...formData, bibliography: newBibliography });
  };

  const handleAddBibliographyField = () => {
    const newBibliography = [...formData.bibliography, { title: "", author: "" }];
    setFormData({ ...formData, bibliography: newBibliography });
  };

  const handleRemoveBibliographyField = (index) => {
    const newBibliography = [...formData.bibliography];
    newBibliography.splice(index, 1);
    setFormData({ ...formData, bibliography: newBibliography });
  };


  const handleSaveChanges = async () => {
    try {
      // Check if the username exists
      console.log(user)
      let adminUsername=user.username
      
      if (formData.code !== selectedcourse.code) {
      const checkCodeResponse = await fetch(
        `/api/v1/course/check-course-code/${encodeURIComponent(formData.code)}`
      );

      if (!checkCodeResponse.ok) {
        const result = await checkCodeResponse.json();
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

      // Update user details
      const updateResponse = await fetch(`/api/v1/coursedetails/${selectedcourse._id}`, {
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
          <span className="material-symbols-outlined close-button" onClick={closeModal}>close</span>
          <h4>Edit Course</h4>
          {error && <p className="error">{error}</p>}
          <label htmlFor='courseCode'>Course Code: </label>
          <input
            id="courseCode"
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleFormChange}
          />

          <label>Title: </label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleFormChange}
          />

          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleFormChange}
          />

          {/* Category Select */}
          <label>Category:</label>
          <Select
            isMulti
            name="category"
            options={categoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={formData.category}
            onChange={handleCategoryChange}
          />

          {/* Instructor Select */}
          <label>Instructor:</label>
          <Select
            name="instructor"
            options={instructors}
            className="basic-single"
            classNamePrefix="select"
            value={formData.instructor}
            onChange={handleInstructorChange}
          />

          {/* Dynamic Bibliography Fields */}
          {formData.bibliography.map((entry, index) => (
            <div key={index}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={entry.title}
                onChange={(e) => handleBibliographyChange(index, "title", e.target.value)}
              />
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={entry.author}
                onChange={(e) => handleBibliographyChange(index, "author", e.target.value)}
              />
              <button onClick={() => handleRemoveBibliographyField(index)}>Remove</button>
            </div>
          ))}
          <button onClick={handleAddBibliographyField}>Add Bibliography Entry</button>

          <label>Admin Password (for verification):</label>
          <input
            type="password"
            value={adminPassword}
            onChange={handleAdminPasswordChange}
          />
          <button type="button" onClick={handleSaveChanges}>Save Changes</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;