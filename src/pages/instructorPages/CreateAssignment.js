import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Assignments.css";
import { toast } from 'react-toastify';

const CreateAssignment = () => {
  const { course_id, instructor_id ,course_code} = useParams();
  console.log(course_id, instructor_id, course_code)

  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newAssignment = {
      title: assignment.title,
      description: assignment.description,
      startDate: assignment.startDate,
      dueDate: assignment.dueDate,
      course: course_id,     
      instructor: instructor_id 
    };
  
    try {
      const response = await fetch('/api/v1/assignments/add-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include your auth token in the request if needed
          // 'Authorization': 'Bearer ' + authToken,
        },
        body: JSON.stringify(newAssignment)
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Assignment created successfully!");
        setAssignment({
          title: "",
    description: "",
    startDate: "",
    dueDate: "",
        })
      } else {
        // Handle errors - for example, show an error message to the user
        console.error('Failed to create assignment:', data.message);
      }
    } catch (error) {
      // Handle network errors
      console.error('Failed to send request:', error);
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
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={assignment.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" name="dueDate" value={assignment.dueDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="button submit-button">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
