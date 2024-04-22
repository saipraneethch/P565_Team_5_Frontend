import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../styles/Assignments.css";

const SubmittedAssignmentDetails = () => {
  const { student_id, assignment_id } = useParams();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState(null);
  const [feedback, setFeedback] = useState(""); // State to hold feedback
  const [grade, setGrade] = useState(""); // State to hold grade

  const fetchStudentDetails = async () => {
    try {
      // Fetch detailed information about the submitted assignment from your backend API
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/assignments/get-student-submitted-assignment/${student_id}/${assignment_id}`
      ); // Adjust the API endpoint as per your backend
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      const { student_submissions, student_detail } = await response.json();
      // Extract grade from student details and set it as initial value of grade state
      const initialGrade =
        student_submissions.length > 0 ? student_submissions[0].grade : "";

      setStudentDetails({
        ...student_detail,
        submissions: student_submissions,
      });
      console.log("grade", initialGrade);
      setGrade(initialGrade); // Set initial value of grade state
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student_id, assignment_id]);

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    try {
      // Logic to submit feedback and grade to backend API
      // Adjust the endpoint and payload structure as per your backend API requirements
      const response = await fetch(
        '${process.env.REACT_APP_API_URL}/api/v1/assignments/submit-feedback-grade',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id,
            assignment_id,
            feedback,
            grade,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit feedback and grade");
      }
      console.log("Feedback and grade submitted successfully");

      // Refetch student details to get updated feedback
      fetchStudentDetails();
      toast.success("Submitted successfully!");
      setFeedback(""); 

    } catch (error) {
      console.error("Error submitting feedback and grade:", error);
      toast.error("Failed to submit.");
    }
  };

  return (
    <div className="assignments-container-submissions">
        <div className="submission-details">
      <button className="back-button" onClick={handleGoBack}>
        Back
      </button>
      <h2>
        {studentDetails.first_name} {studentDetails.last_name}
      </h2>
      {studentDetails.submissions
        .sort((a, b) => new Date(b.submittedOn[0]) - new Date(a.submittedOn[0])) // Sort submissions by submission time in descending order
        .map((submission, index) => (
          <div key={index} className="assignment-list-item">
            <h3>Submitted Assignment</h3>
            {submission.submittedOn.map((submissionDate, dateIndex) => (
              <p key={dateIndex}>
                Submitted on: {new Date(submissionDate).toLocaleString()}
              </p>
            ))}
            {submission.submissionContent.map((fileUrl, fileIndex) => (
              <a
                key={fileIndex}
                className="button"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Submission {fileIndex + 1}
              </a>
            ))}
          </div>
        ))}
      <div className="form-group">
        <label htmlFor="gradeInput">Grade:</label>
        <input
          type="number"
          id="gradeInput"
          className="form-control"
          value={grade}
          onChange={handleGradeChange}
          style={{ width: "50px" }} // Adjust the width as needed
        />
      </div>
      <button className="submit-button" onClick={handleSubmitFeedback}>
          Submit/Update Grade
        </button>
      </div>

      <div className="feedback-area">
      <div className="feedback-list">
  <h3>Previous Feedback</h3>
  {/* Map over previous feedbacks */}
  {studentDetails.submissions.map((submission, index) =>
    submission.feedback.length > 0 ? (
      submission.feedback.map((fb, fbIndex) => (
        <div key={`${index}-${fbIndex}`} className="previous-feedback">
          <div className="feedback-content">{fb}</div>
        </div>
      ))
    ) : (
      // Only show "No feedback provided" if there is no feedback at all for this submission
      <div key={index} className="previous-feedback">
        <div className="feedback-content">No feedback provided</div>
      </div>
    )
  )}
</div>



      <div className="submit-feedback-container">
        <h3>Submit New Feedback</h3>
        <textarea
          className="form-group"
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Add feedback/comment"
        ></textarea>
        <button className="submit-button" onClick={handleSubmitFeedback}>
          Add Feedback/Comment
        </button>
      </div>
    </div>
  </div>
  );
};

export default SubmittedAssignmentDetails;
