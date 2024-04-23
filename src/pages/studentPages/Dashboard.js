import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/DashboardPage.css";

const StudentDashboard = () => {
  const { user } = useAuthContext();
  const [coursesInfo, setCoursesInfo] = useState({});
  const [assignments, setAssignments] = useState({});
  const [announcements, setAnnouncements] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_id = user._id;

  const formatDate = (isoDateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    const date = new Date(isoDateString);
    return date.toLocaleString('en-US', options);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/dashboard/getCourses/${user_id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const { coursesInfo, assignments, announcements } = await response.json();

        setCoursesInfo(coursesInfo);
        setAssignments(assignments);
        setAnnouncements(announcements);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]); // Dependency array includes user to re-fetch when user changes

  const renderCourseDetails = (courseId) => {
    const course = coursesInfo[courseId];

    if (!course) {
      return <p>No courses enrolled</p>;
    }

    const courseAssignments = assignments[courseId] || [];
    const courseAnnouncements = announcements[courseId] || [];

    return (
      <div key={courseId} className="course-section">
        <h2>{course.courseCode}: {course.courseTitle}</h2>
        <h3>Upcoming Assignments:</h3>
        {courseAssignments.length > 0 ? (
          <ul>
            {courseAssignments.map((assignment) => (
              <li key={assignment._id}>
                {assignment.title} - Due: {formatDate(assignment.dueDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming assignments.</p>
        )}
        
        <h3>Latest Announcements:</h3>
        {courseAnnouncements.length > 0 ? (
          <ul>
            {courseAnnouncements.map((announcement) => (
              <li key={announcement._id}>
                {announcement.title}: {announcement.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent announcements.</p>
        )}
      </div>
    );
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Student Dashboard, {user ? user.username : "Guest"}</h1>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="courses-container">
          {Object.keys(coursesInfo).map((courseId) => renderCourseDetails(courseId))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
