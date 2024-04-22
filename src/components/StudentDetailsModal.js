import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/StudentDetailsModal.css";
// import "../styles/CourseDetails.css";

const StudentDetailsModal = ({ show, handleClose, student, course_id }) => {
  const [details, setDetails] = useState({ assignments: [] });
  const [grade, setGrade] = useState("");
  const student_id = student._id;

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/assignments/student-details/${course_id}/${student_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }
        const { student_grade, data } = await response.json();
        setDetails(data);
        setGrade(student_grade);
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      }
    };

    if (show) {
      fetchStudentDetails();
    }
  }, [show, student_id, course_id]);

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  };

  return (
    <div className={`user-details-modal ${show ? "user-details-show" : ""}`}>
      <div className="user-details-modal-overlay" onClick={handleClose}></div>
      <div className="user-details-modal-popup">
        <div className="user-details-modal-header">
          <h3>
            {student.first_name} {student.last_name}'s Details
          </h3>
          <span className="user-details-close-button" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="user-details-modal-content">
          <h5>
            Grade:{" "}
            {grade
              ? `${grade}% (${getLetterGrade(grade)})`
              : "No grade available"}
          </h5>

          <h5>Assignments</h5>
          <ul>
            {details.assignments.map((assignment, index) => (
              <li key={index}>
                {assignment.submissions.some(
                  (submission) =>
                    submission.student && submission.student._id === student_id
                ) ? (
                  <Link
                    to={`/assignment-submissions/submitted-assignment/${student_id}/${assignment._id}`}
                  >
                    {assignment.title}
                  </Link>
                ) : (
                  <span>{assignment.title}</span>
                )}
                :{" "}
                {assignment.submissions.some(
                  (submission) =>
                    submission.student && submission.student._id === student_id
                ) ? (
                  assignment.submissions.map((submission, subIndex) => {
                    if (
                      submission.student &&
                      submission.student._id === student_id
                    ) {
                      return (
                        <p key={subIndex}>
                          <strong>Grade:</strong>{" "}
                          {submission.grade !== undefined
                            ? submission.grade === null
                              ? "Not Graded"
                              : submission.grade + "/100"
                            : "Not Graded"}
                        </p>
                      );
                    }
                    return null;
                  })
                ) : (
                  <em>Not submitted</em>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="user-details-modal-footer">
          {/* <button className="user-details btn btn-secondary" onClick={handleClose}>
            Close
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
