import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/DashboardPage.css"; // Make sure these paths match your project structure

const StudentDashboard = () => {
  const { user } = useAuthContext();

  // Dummy assignments data
  const assignments = [
    { name: "Assignment 1", dueDate: "2024-04-10", course: "Math 101" },
    { name: "Assignment 2", dueDate: "2024-05-15", course: "History 202" },
    { name: "Assignment 3", dueDate: "2024-06-20", course: "Science 303" },
    { name: "Assignment 4", dueDate: "2024-07-25", course: "English 404" },
  ];

  return (
      <div className="home-container h1">
        <h1>Welcome to the Student Dashboard, {user ? user.username : "Guest"}</h1>
        <div className="assignments-container">
          <h2>Pending Assignments</h2>
          <ul>
            {assignments.map((assignment, index) => (
              <li key={index}>
                {assignment.name} - {assignment.course} - Due: {assignment.dueDate}
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default StudentDashboard;
