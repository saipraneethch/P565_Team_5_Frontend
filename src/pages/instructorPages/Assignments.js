// AssignmentComponent.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Assignments.css";

const Assignments = ({ courseId, professorId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  const { course_id, instructor_id, course_code } = useParams();
  

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true); 
      try {
        // This URL will need to be updated to your API endpoint for fetching assignments
        const response = await fetch(
          `/api/v1/assignments/${course_id}/${instructor_id}`,{
            method:'GET'
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const assignments = await response.json();
        console.log(assignments.data)
        setAssignments(assignments.data || []); 
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [course_id, instructor_id]); // Depend on courseId and professorId to refetch when they change

  const handleBack = () => {
    navigate("/courses"); 
  };

  const handleCreateAssignment = () => {
    // Navigate to the route where creating a new assignment is handled
    navigate(`/create-assignment/${course_id}/${instructor_id}/${course_code}`);
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <button onClick={handleBack} className="button">Back</button>
        <button onClick={handleCreateAssignment} className="button">Create New Assignment</button>
      </div>
      <h2>Assignments for Course: {course_code}</h2>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id}>
              <h3>{assignment.title}</h3>
              <p>Description: {assignment.description}</p>
              <p>Start Date: {formatDate(assignment.startDate)}</p>
              <p>Due Date: {formatDate(assignment.dueDate)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments created yet.</p>
      )}
    </div>
  );
};

export default Assignments;
