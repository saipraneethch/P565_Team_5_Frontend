// // AssignmentComponent.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/Assignments.css";

// const CreateAssignment = ({ courseId, professorId }) => {
  
//   const navigate = useNavigate();

 

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="assignments-container">
//       <div className="assignments-header">
//         <button onClick={handleBack} className="button">
//           Back
//         </button>
//       </div>
      
//     </div>
//   );
// };

// export default CreateAssignment;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Assignments.css";
import { toast } from 'react-toastify';
const CreateAssignment = () => {
  const { course_id, instructor_id, course_code } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setAssignmentFile(e.target.files[0]);
  };
  const getCurrentDateTimeForInput = () => {
    return new Date().toISOString().slice(0, 16);
  };
  const validateFields = () => {
    let tempErrors = {};
    const startDate = new Date(assignment.startDate);
    const dueDate = new Date(assignment.dueDate);
    // startDate should not be in the past and should be at least today's date
    if (startDate < new Date()) {
      tempErrors.startDate = "Start date should be today or later.";
    }
    // dueDate should be after startDate
    if (dueDate <= startDate) {
      tempErrors.dueDate = "Due date should be after the start date.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateFields()) {
    toast.error("Please correct the errors before submitting.");
    return;
  }
  const formData = new FormData();
  formData.append("title", assignment.title);
  formData.append("description", assignment.description);
  formData.append("startDate", assignment.startDate);
  formData.append("dueDate", assignment.dueDate);
  formData.append("course", course_id);
  formData.append("instructor", instructor_id);
  if (assignmentFile) {
    formData.append("file", assignmentFile, assignmentFile.name);
  }
  try {
    const response = await fetch("/api/v1/assignments/add-assignment", {
      method: "POST",
      // Remove 'Content-Type': 'application/json', from headers
      // Add your authentication header if needed
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Assignment created successfully!");
      navigate(-1); // Navigate back
    } else {
      toast.error(`Failed to create assignment: ${data.message}`);
    }
  } catch (error) {
    toast.error(`Error creating new assignment: ${error}`);
  }
};
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <button onClick={handleBack} className="button back-button">
          Back
        </button>
      </div>
      <h2>Create Assignment for Course: {course_code}</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={assignment.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={assignment.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="file">Assignment Material (optional)</label>
          <input type="file" id="file" name="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date and Time</label>
          <input type="datetime-local" id="startDate" name="startDate"
                 value={assignment.startDate} onChange={handleChange} required
                 min={getCurrentDateTimeForInput()}/>
          {errors.startDate && <div className="error">{errors.startDate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date and Time</label>
          <input type="datetime-local" id="dueDate" name="dueDate"
                 value={assignment.dueDate} onChange={handleChange} required />
          {errors.dueDate && <div className="error">{errors.dueDate}</div>}
        </div>
        <button type="submit" className="button submit-button">Create Assignment</button>
      </form>
    </div>
  );
};
export default CreateAssignment;