// AssignmentComponent.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AssignmentList from "../../components/AssignmentList"; // Import AssignmentList component
import ModuleList from "../../components/ModuleList"; // Import ModuleList component
import AnnouncementList from "../../components/AnnouncementList";

import "../../styles/Assignments.css";


const InsideEnrolledCourse = ({ courseId, professorId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("assignments");

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

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/announcements/${course_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch announcements.");

      const data = await response.json();
      setAnnouncements(data.data || []);
      console.log("Announcements:", data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setAnnouncements([]); 
    } finally {
      setLoading(false);
    }
  }, [course_id]); // course_id is a dependency

  useEffect(() => {
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab, course_id, fetchAnnouncements]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleBack = () => {
    navigate("/courses");
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
    return <p>Loading..</p>;
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <button onClick={handleBack} className="button">
          Back
        </button>
        
      </div>
      <h2>Content for Course: {course_code}</h2>
      
      <div className="tabs">
      <button
          className={`tab-button ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => handleTabClick("announcements")}
        >
          Announcements
        </button>
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
          {activeTab === "announcements" && (
            <AnnouncementList
            announcements={announcements}
            onAnnouncementsChange={fetchAnnouncements}
              role="student"
            />
          )}
          {activeTab === "assignments" && (
            <AssignmentList
              assignments={assignments}
              formatDateWithTime={formatDateWithTime}
              role="student"
              
            />
          )}
          {activeTab === "modules" && (
            <ModuleList modules={modules} onModulesChange={fetchModules} role="student" />
          )}

         
        </div>
      )}
    </div>
  );
};

export default InsideEnrolledCourse;
