import React, { useState, useEffect } from "react";
import "../styles/CourseDetails.css"; // Adjust if needed
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatInTimeZone } from "date-fns-tz";

import { useAuthContext } from "../hooks/useAuthContext";

const CourseEditModal = ({ selectedcourse, closeModal, refreshCourses }) => {
  const { user } = useAuthContext();

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if no date is provided

    const date = new Date(dateString); // Convert string to Date
    const timeZone = "America/New_York"; // EST/EDT

    // Format the date to "yyyy-MM-dd" in the specified time zone
    return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
  };

  // Adjusting initial state to handle category and instructor as objects compatible with react-select
  const [formData, setFormData] = useState({
    ...selectedcourse,
    category: selectedcourse.category.map((cat) => ({
      value: cat,
      label: cat,
    })),
    instructor: {
      value: selectedcourse.instructor._id,
      label: selectedcourse.instructor.name,
    }, // Assuming this structure
    start_date: formatDate(selectedcourse.start_date), // Format start_date
    end_date: formatDate(selectedcourse.end_date), // Format end_date
  });

  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]); // Example categories, fetch these as needed
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    // Set the category options once the component mounts
    setCategoryOptions([
      { value: "business", label: "Business" },
      { value: "engineering", label: "Engineering" },
      { value: "arts", label: "Arts" },
      { value: "music", label: "Music" },
      { value: "computer science", label: "Computer Science" },
      { value: "data science", label: "Data Science" },
      { value: "healthcare", label: "Healthcare" },
      { value: "education", label: "Education" },
      { value: "science", label: "Science" },
      { value: "finance", label: "Finance" },
      { value: "technology", label: "Technology" },
      { value: "environment", label: "Environment" },
      { value: "agriculture", label: "Agriculture" },
      { value: "architecture", label: "Architecture" },
      { value: "hospitality", label: "Hospitality" },
      { value: "law", label: "Law" },
      { value: "media", label: "Media" },
      { value: "philosophy", label: "Philosophy" },
      { value: "psychology", label: "Psychology" },
      { value: "sociology", label: "Sociology" },
      { value: "sports", label: "Sports" },
      // Add more categories as needed
    ]);
  }, []);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          "/api/v1/coursedetails/get-instructors/all-instructors",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setInstructors(
            data.map((instructor) => ({
              value: instructor._id,
              label: `${instructor.first_name} ${instructor.last_name}`,
            }))
          );
        } else {
          throw new Error("Failed to fetch instructors");
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, [user.token]);

  useEffect(() => {
    if (user && selectedcourse.instructor) {
      const fetchInstructorName = async () => {
        try {
          const response = await fetch(
            `/api/v1/coursedetails/get-single-instructor/${selectedcourse.instructor}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              instructor: {
                value: data._id,
                label: `${data.first_name} ${data.last_name}`,
              },
            }));
          } else {
            throw new Error("Failed to fetch instructor details");
          }
        } catch (error) {
          console.error("Failed to fetch instructor details:", error);
        }
      };
      fetchInstructorName();
    }
  }, [selectedcourse.instructor, user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" || name === "instructor") return; // Skip for select handled fields
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

  const handleSaveChanges = async () => {
    try {
      // Check if the username exists

      let adminUsername = user.username;

      if (formData.code !== selectedcourse.code) {
        const checkCodeResponse = await fetch(
          `/api/v1/course/check-course-code/${encodeURIComponent(
            formData.code
          )}`
        );

        if (!checkCodeResponse.ok) {
          const result = await checkCodeResponse.json();
          throw new Error(result.message || "Username check failed.");
        }
      }

      // Verify admin password

      const verifyPasswordResponse = await fetch(
        "/api/v1/userdetails/verify-admin",
        {
          method: "POST",
          body: JSON.stringify({
            username: adminUsername,
            password: adminPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!verifyPasswordResponse.ok) {
        const result = await verifyPasswordResponse.json();
        throw new Error(
          result.message || "Admin password verification failed."
        );
      }

      // Convert category options to an array of strings
      const categoryValues = formData.category.map((cat) => cat.value);
      // Extract ObjectId from instructor object
      const instructorId = formData.instructor.value;

      // Update user details
      const updateResponse = await fetch(
        `/api/v1/coursedetails/update-course/${selectedcourse._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...formData,
            instructor: instructorId,
            category: categoryValues, // Set category to an array of strings
          }),
        }
      );

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || "Update failed.");
      }

      // If successful, close the modal
      toast.success("Course details updated successfully");
      closeModal();
      refreshCourses();
    } catch (error) {
      toast.error(error.message || "Failed to update cOurse details");
      setError(error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-popup">
        <div className="edit-course-modal-content">
          <span
            className="material-symbols-outlined close-button"
            onClick={closeModal}
          >
            close
          </span>
          <h4>Edit Course</h4>
          {error && <p className="error">{error}</p>}
          <label htmlFor="courseCode">Course Code: </label>
          <input
            id="courseCode"
            type="text"
            name="code"
            value={formData.code || ""}
            onChange={handleFormChange}
          />

          <label>Title: </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleFormChange}
          />

          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description || ""}
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

          {/* Start Date */}
          <label>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date || ""}
            onChange={handleFormChange}
          />

          {/* End Date */}
          <label>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date || ""}
            onChange={handleFormChange}
          />

          <br></br>
          <label>Admin Password (for verification):</label>
          <input
            type="password"
            value={adminPassword}
            onChange={handleAdminPasswordChange}
          />
          <button type="button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
