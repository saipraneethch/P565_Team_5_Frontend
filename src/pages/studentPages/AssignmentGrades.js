import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Assignments.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import GaugeChart from 'react-gauge-chart';

const AssignmentGrades = () => {
  const { course_id, course_code } = useParams();
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchAssignmentGrades = async () => {
      try {
        const response = await fetch(
          `/api/v1/assignments/get-assignment-grades`,
          {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              course_id: course_id,
              user_id: user._id,
            }),
          }
        );
        const json = await response.json();
        if (response.ok) {
          setAssignments(json);
        } else {
          console.error("Failed to fetch assignment grades:", json.error);
        }
      } catch (error) {
        console.error("Failed to fetch assignment grades:", error);
      }
    };

    fetchAssignmentGrades();
  }, [course_id, user.token, user._id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="assignments-container">
      <button className="back-button" onClick={handleGoBack}>
        Back
      </button>
      <h2>Assignment Grades for {course_code}</h2>
      <div className="assignment-list">
        {assignments.length === 0 ? (
          <p className="no-assignments">No assignments found.</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment._id} className="assignment-list-item">
              <p><strong>Assignment:</strong> {assignment.title}</p>
              {assignment.submissions.some(submission => submission.student === user._id) ? (
                <GaugeChart id="gauge-chart3"
                  nrOfLevels={30}
                  colors={["#FF5F6D", "#FFC371", "#FF5F6D"]}
                  arcWidth={0.3}
                  percent={(assignment.submissions.find(submission => submission.student === user._id).grade || 0) / 100}
                />
              ) : (
                <p><strong>Grade:</strong> Not Graded</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentGrades;
