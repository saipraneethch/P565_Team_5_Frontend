import React from "react";
import SearchComponent from "./SearchComponent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const AssignmentList = ({
  assignments,
  formatDateWithTime,
  onEdit,
  onDelete,
  role,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState({
    upcomingAssignments: [],
    pastAssignments: [],
  });
  const navigate = useNavigate();
  const user = useAuthContext();

  // Function to handle file download
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = fileUrl.split("/").pop(); // Extracts the file name for the 'download' attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredAssignments({
      upcomingAssignments: [],
      pastAssignments: [],
    });
  };
  const handleAssignmentClick = (assignment) => {
    if (role === "instructor") {
      // Navigate to a page showing all submissions for this assignment
      navigate(`/assignment-submissions/${assignment._id}`);
    } else {
      // Navigate to a page where the student can submit their assignment
      navigate(`/submit-assignment/${assignment._id}`);
    }
  };

  useEffect(() => {
    const now = new Date();
    const matchedAssignments = searchQuery
      ? assignments.filter(
          (assignment) =>
            assignment.title.toLowerCase().includes(searchQuery) ||
            assignment.description.toLowerCase().includes(searchQuery)
        )
      : assignments;

    setFilteredAssignments({
      upcomingAssignments: matchedAssignments.filter(
        (assignment) => new Date(assignment.dueDate) > now
      ),
      pastAssignments: matchedAssignments.filter(
        (assignment) => new Date(assignment.dueDate) <= now
      ),
    });
  }, [assignments, searchQuery]);

  const getSubmissionStatus = (assignment) => {
    const now = new Date();
    let submissionDate = null; // Initialize submissionDate variable

    // Check if the user has submitted the assignment
    const userSubmission = assignment.submissions.find(
      (submission) => submission.student.toString() === user.user._id.toString()
    );

    if (userSubmission) {
      submissionDate = new Date(userSubmission.submittedOn[userSubmission.submittedOn.length - 1]);
    }
    console.log(
      "submissionDate",
      submissionDate,
      "assignment.dueDate",
      assignment.dueDate
    );
    const dueDate = new Date(assignment.dueDate);

    if (submissionDate && submissionDate <= dueDate) {
      return `Submitted on time (${formatDateWithTime(submissionDate)})`;
    } else if (submissionDate && now > dueDate && submissionDate > dueDate) {
      return `Submitted late (${formatDateWithTime(submissionDate)})`;
    } else if (now < dueDate) {
      return `No Submission yet`;
    } else {
      return "Missing";
    }
  };

  return (
    <>
      <SearchComponent
        searchText={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onClear={handleClear}
        placeholder="Search assignments..."
      />
      {filteredAssignments.upcomingAssignments.length > 0 && (
        <>
          <h2>Upcoming Assignments</h2>
          <ul>
            {filteredAssignments.upcomingAssignments.map((assignment) => (
              <li key={assignment._id} style={{ position: "relative" }}>
                {role === "instructor" && (
                  <div
                    style={{ position: "absolute", right: "0px", top: "0px" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => onEdit(assignment)}
                    >
                      edit
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ cursor: "pointer" }}
                      onClick={() => onDelete(assignment._id)}
                    >
                      delete
                    </span>
                  </div>
                )}
                <div onClick={() => handleAssignmentClick(assignment)}>
                  <h3>{assignment.title}</h3>
                  <p>Description: {assignment.description}</p>
                  <p>Start Date: {formatDateWithTime(assignment.startDate)}</p>
                  <p>Due Date: {formatDateWithTime(assignment.dueDate)}</p>
                  {role === "student" && (
                    <p>Submission Status: {getSubmissionStatus(assignment)}</p>
                  )}
                </div>

                {assignment.fileUrl && (
                  <button onClick={() => handleDownload(assignment.fileUrl)}>
                    Download Assignment Material
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {filteredAssignments.pastAssignments.length > 0 && (
        <>
          <h2>Past Assignments</h2>
          <ul>
            {filteredAssignments.pastAssignments.map((assignment) => (
              <li key={assignment._id} style={{ position: "relative" }}>
                <div onClick={() => handleAssignmentClick(assignment)}>
                  <h3>{assignment.title}</h3>
                  <p>Description: {assignment.description}</p>
                  <p>Start Date: {formatDateWithTime(assignment.startDate)}</p>
                  <p>Due Date: {formatDateWithTime(assignment.dueDate)}</p>
                  {role === "student" && (
                    <p>Submission Status: {getSubmissionStatus(assignment)}</p>
                  )}
                </div>
                {assignment.fileUrl && (
                  <button onClick={() => handleDownload(assignment.fileUrl)}>
                    Download Assignment Material
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {assignments.length === 0 && <p>No assignments created yet.</p>}
    </>
  );
};

export default AssignmentList;