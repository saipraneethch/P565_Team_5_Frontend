import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../../styles/Assignments.css";

const AssignmentSubmissions = () => {
  const [submittedStudents, setSubmittedStudents] = useState([]);
  const [notSubmittedStudents, setNotSubmittedStudents] = useState([]);
  const { assignment_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Fetch the assignment and student details
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/assignments/all-students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assignment_id }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch assignment details");
        }
        const { assignment, submittedStudents, notSubmittedStudents } = await response.json();

        // Match submitted students with assignment submissions to get submittedOn
        const uniqueSubmittedStudents = new Set();
        const updatedSubmittedStudents = submittedStudents.map(student => {
          const submission = assignment.submissions.find(sub => sub.student === student.id);
          const studentData = { ...student, submittedOn: submission ? submission.submittedOn : null, grade: submission ? submission.grade : null };
          if (!uniqueSubmittedStudents.has(studentData.id)) {
            uniqueSubmittedStudents.add(studentData.id);
            return studentData;
          }
          return null; // Return null for duplicate students
        }).filter(Boolean); // Remove null values (duplicates)

        setSubmittedStudents(updatedSubmittedStudents);
        setNotSubmittedStudents(notSubmittedStudents);

      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [assignment_id]);

  return (
    <div className="assignments-container">
      <button className="button back-button" onClick={() => navigate(-1)}>Back</button>
      <div className="assignments-header">
        <h2 className="assignments-title">Submitted Assignments</h2>
      </div>
      <div className="tab-content active">
        <div className="assignment-list">
          <h3>Submitted Students:</h3>
          <ul>
            {submittedStudents.map((student, index) => (
              <li key={index} className="assignment-list-item">
                <Link to={`/assignment-submissions/submitted-assignment/${student.id}/${assignment_id}`}>
                  {student.first_name} {student.last_name}
                </Link>
                {student.submittedOn && (
                  <span> - Submitted on: {new Date(student.submittedOn[student.submittedOn.length - 1]).toLocaleString()}</span>
                )}
              {student.grade ? (
  <span> - Graded -   <strong>{student.grade}/100</strong></span>
) : (
  <span> - Not Graded</span>
)}


              </li>
            ))}
          </ul>
        </div>
        <div className="assignment-list">
          <h3>Not Submitted Students:</h3>
          <ul>
            {notSubmittedStudents.map((student, index) => (
              <li key={index} className="assignment-list-item">
                {student.first_name} {student.last_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
