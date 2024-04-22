import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Combined imports
import { useAuthContext } from "../../hooks/useAuthContext";

import '../../index.css';
import "../../styles/CourseDetails.css";

const ViewCourse = () => {
    
  const { user } = useAuthContext();
  const { courseId } = useParams();
  const [instructorName, setInstructorName] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/${courseId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const data = await response.json();
            
            if (response.ok) {
                setCourseDetails(data);
            }
          } catch (error) {
            console.error("Failed to fetch course details:", error);
          }
    };

    if (user.token) fetchCourseDetails();
  }, [courseId, user.token]);

  useEffect(() => {
    if (!courseDetails || !courseDetails.instructor) return;

    const fetchInstructorName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-single-instructor/${courseDetails.instructor}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setInstructorName(`${data.first_name} ${data.last_name}`);
        }
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
        setInstructorName("Unknown");
      }
    };

    fetchInstructorName();
  }, [courseDetails?.instructor, user.token]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!courseDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-container">
      <div className="course-details">
        <div className="view-course">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <h2>{courseDetails.title} ({courseDetails.code})</h2>
          <p><strong>Description:</strong> {courseDetails.description}</p>
          <p><strong>Categories:</strong> {courseDetails.category.join(', ')}</p>
          <p><strong>Instructor:</strong> {instructorName}</p>
          <p><strong>Start Date:</strong> {new Date(courseDetails.start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(courseDetails.end_date).toLocaleDateString()}</p>
          {courseDetails.bibliography && courseDetails.bibliography.length > 0 && (
            <div>
              <h3>Bibliography</h3>
              <ul>
                {courseDetails.bibliography.map((item, index) => (
                  <li key={index}>{item.title} by {item.author}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
