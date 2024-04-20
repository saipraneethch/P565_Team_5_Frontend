import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/DashboardPage.css";

const StudentDashboard = () => {
  const { user } = useAuthContext(); 
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    const date = new Date(isoDateString);
    return date.toLocaleString('en-US', options);
  };

  const fetchCourseTitle = async (courseId) => {
    try {
      const response = await fetch(`/api/v1/courses/${courseId}`, { method: "GET" });
      if (!response.ok) {
        throw new Error('Failed to fetch course title');
      }
      const data = await response.json();
      return data.title;  // Assuming the API returns an object with a title property
    } catch (error) {
      console.error("Error fetching course title:", error);
      return "Unknown Course";  // Fallback title in case of an error
    }
  };
  

 
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`/api/v1/assignments/getCourses/now/${user._id}`, { method: "GET" });
        if (!response.ok) {
          if (response.status === 404) {
            setError("No assignments found.");
            throw new Error(error.message) 
          } else {
            throw new Error('Network response was not ok');
          }
        }
                
        const result = await response.json();
        const assignmentsArray = result.data;
  
        // Fetch course titles for all assignments and enhance each assignment with its title
        const assignmentsWithTitles = await Promise.all(assignmentsArray.map(async (assignment) => {
          const courseTitle = await fetchCourseTitle(assignment.course);
          return {...assignment, courseTitle}; // Store course title in a new property
        }));
  
        // Sort assignments by due date
        assignmentsWithTitles.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); 
        console.log("API Response:", result);
        setAssignments(assignmentsWithTitles);
        console.log("Assignments Set:", assignmentsWithTitles);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user) {
      fetchAssignments();
    }
  }, [user]); // Dependency array includes user to re-fetch when user changes
  
  return (
    <div className="home-container">
      <h1>Welcome to the Student Dashboard, {user ? user.username : "Guest"}</h1>
      <div className="assignments-container">
        <h2>Pending Assignments</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment, index) => (
              <li key={index}>
                {assignment.title} - {assignment.courseTitle} - Due: {formatDate(assignment.dueDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no assignments!</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
