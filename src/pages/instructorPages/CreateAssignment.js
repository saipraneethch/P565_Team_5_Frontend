// AssignmentComponent.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Assignments.css";

const CreateAssignment = ({ courseId, professorId }) => {
  
  const navigate = useNavigate();

 

  const handleBack = () => {
    navigate(-1);
  };

 

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <button onClick={handleBack} className="button">
          Back
        </button>
      </div>
      
    </div>
  );
};

export default CreateAssignment;
