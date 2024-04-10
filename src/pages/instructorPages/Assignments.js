// AssignmentComponent.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Assignments.css";

const Assignments = ({ courseId, professorId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        // This URL will need to be updated to your API endpoint for fetching assignments
        const response = await fetch(
          `/api/assignments/${courseId}/${professorId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAssignments(data.assignments);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId, professorId]); // Depend on courseId and professorId to refetch when they change

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreateAssignment = () => {
    // Navigate to the route where creating a new assignment is handled
    navigate("/create-assignment");
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <button onClick={handleBack} className="button">
          Back
        </button>
        <button onClick={handleCreateAssignment} className="button">
          Create New Assignment
        </button>
        <button onClick={handleUploadContent} className="button">
          Upload Content
        </button>
      </div>
      <h2>Content for Course: {course_code}</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => handleTabClick("assignments")}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === "modules" ? "active" : ""}`}
          onClick={() => handleTabClick("modules")}
        >
          Modules
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <div className="tab-content">
          {activeTab === "assignments" && (
            <AssignmentList
              assignments={assignments}
              formatDateWithTime={formatDateWithTime}
              onEdit={handleEdit}
              onDelete={handleDelete}
              role="instructor"
            />
          )}
          {activeTab === "modules" && (
            <ModuleList modules={modules} onModulesChange={fetchModules} role="instructor"/>
          )}
        </div>
      )}
      <h2>Assignments for Course ID: {courseId}</h2>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id}>{assignment.title}</li>
          ))}
        </ul>
      ) : (
        <p>No assignments created yet.</p>
      )}
    </div>
  );
}  
  

export default Assignments;
