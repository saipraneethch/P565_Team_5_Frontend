import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/Assignments.css";
import SubmittedFilesList from "../../components/SubmittedFilesList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignmentFeedback = () => {
  const navigate = useNavigate();
  const user = useAuthContext();
  const { assignment_id } = useParams();
  const [feedback, setFeedback] = useState(""); // State to hold feedback
  const [studentDetails, setStudentDetails] = useState({
    submissions: [],
  }); // State to hold student details

  const user_id=user.user._id

  const handleCancel = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URL}/api/v1/assignments/submit-user-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.user.token}`,
          },
          body: JSON.stringify({
            user_id,
            username: user.user.username,
            assignment_id,
            feedback,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit feedback and grade");
      }
      console.log("Feedback and grade submitted successfully");
      fetchStudentDetails();
      toast.success("Submitted successfully!");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback and grade:", error);
      toast.error("Failed to submit.");
    }
  };

const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/assignments/get-student-submitted-assignment/${user_id}/${assignment_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }
        const { student_submissions, student_detail } = await response.json();
        setStudentDetails({
          ...student_detail,
          submissions: student_submissions,
        });
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    useEffect(() => {
        fetchStudentDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user_id, assignment_id]);

  return (
    <div className="assignments-container-submissions">
      <div className="submission-details">
        <button type="button" onClick={handleCancel}>
          Back
        </button>
        <div>
          <SubmittedFilesList assignmentId={assignment_id} />
        </div>
      </div>
      <div className="feedback-area">
      <div className="feedback-list">
        <h3>Previous Feedback</h3>
        {studentDetails.submissions.map((submission, index) =>
          submission.feedback.length > 0 ? (
            submission.feedback.map((fb, fbIndex) => (
              <div
                key={`${index}-${fbIndex}`}
                className="previous-feedback"
              >
                <div className="feedback-content">{fb}</div>
              </div>
            ))
          ) : (
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

export default AssignmentFeedback;
