// AssignmentComponent.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AssignmentList from "../../components/AssignmentList"; // Import AssignmentList component
import ModuleList from "../../components/ModuleList"; // Import ModuleList component
import EditAssignmentModal from "../../components/EditAssignment";

import "../../styles/Assignments.css";
import { toast } from "react-toastify";

const Assignments = ({ courseId, professorId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState("assignments");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const navigate = useNavigate();

  const { course_id, instructor_id, course_code } = useParams();

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/assignments/${course_id}/${instructor_id}`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setAssignments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  }, [course_id, instructor_id]);

  // Use useEffect to call fetchAssignments
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/coursedetails/display-content/${course_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch modules.");

      const data = await response.json();
      setModules(data || []);
      console.log("Modules:", data);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    } finally {
      setLoading(false);
    }
  }, [course_id]); // course_id is a dependency

  useEffect(() => {
    if (activeTab === "modules") fetchModules();
  }, [activeTab, course_id, fetchModules]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleBack = () => {
    navigate("/courses");
  };

  const handleCreateAssignment = () => {
    // Navigate to the route where creating a new assignment is handled
    navigate(`/create-assignment/${course_id}/${instructor_id}/${course_code}`);
  };

  const handleUploadContent = () => {
    // Navigate to the route where creating a new assignment is handled
    navigate(`/upload-content/${course_id}`);
  };

  const handleEdit = (assignment) => {
    setCurrentAssignment(assignment);
    setEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditModalVisible(false);
    fetchAssignments(); // Refresh assignments after modal close
  };

  const handleSaveChanges = async (formData, assignmentId) => {
    try {
      console.log("Inside handleSaveChanges")
      const response = await fetch(`/api/v1/assignments/${assignmentId}`, {
        method: "PATCH",
        body: formData,
       
      });

      if (!response.ok) throw new Error("Update failed");
      toast.success("Assignment updated successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update assignment:", error);
      toast.error(`Error updating assignment: ${error}`);
    }
  };

  const handleDelete = async (assignmentId) => {
    // Logic to handle delete
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const response = await fetch(`/api/v1/assignments/${assignmentId}`, {
          method: "DELETE",
          // Add any needed headers, like authorization headers
        });
        if (!response.ok) throw new Error("Deletion failed");

        // If deletion is successful, refetch the assignments or remove the item from state
        setAssignments(
          assignments.filter((assignment) => assignment._id !== assignmentId)
        );
      } catch (error) {
        console.error("Failed to delete assignment:", error);
        // Handle error, possibly by setting an error state or displaying a message
      }
    }
  };

  const formatDateWithTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
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
        <div>
        <button onClick={handleCreateAssignment} className="button new-assignment">
          Create New Assignment
        </button>
        <button onClick={handleUploadContent} className="button upload-content">
          Upload Content
        </button>
        </div>
      </div>
      <h2>Content for Course: {course_code}</h2>
      <div className="tabs">
        <button
          className={`tab-button ${
            activeTab === "assignments" ? "active" : ""
          }`}
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

          {editModalVisible && (
            <EditAssignmentModal
              assignment={currentAssignment}
              onSave={handleSaveChanges}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;
