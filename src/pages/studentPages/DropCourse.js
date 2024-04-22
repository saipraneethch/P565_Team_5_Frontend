import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useCoursesContext } from "../../hooks/useCoursesContext";
import { useUsersContext } from "../../hooks/useUserContext";

import "../../styles/CourseDetails.css";
import { toast } from 'react-toastify';

const CourseDetail = ({ coursedetail, setRefetchTrigger }) => {
  const [instructorName, setInstructorName] = useState(""); // State to store instructor name
  const { user } = useAuthContext();
  const {dispatch}=useUsersContext();


  
  
  useEffect(() => {
    const fetchInstructorName = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-single-instructor/${coursedetail.instructor}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setInstructorName(`${data.first_name} ${data.last_name}`);
        }
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
        setInstructorName("Unknown");
      }
    };

    if (user) {
      fetchInstructorName();
    }
  }, [coursedetail.instructor, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDrop = async (courseId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails/${user.username}/drop-course`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ courseId: courseId })
      });
  
      if (!response.ok) {
        throw new Error('Failed to drop the course');
      }
  
      // Assuming the backend returns the updated user data
      const updatedUser = await response.json();
      // Dispatch an action to update the user in your context
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });

      // Show success toast
    toast.success("Course dropped successfully!");
    // Toggle refetchTrigger to re-fetch courses
setRefetchTrigger(prev => !prev);
  
  
    } catch (error) {
      console.error("Failed to drop the course:", error);
    }
  };
  
  

  return (
    <div className="course-details">
      
      <div className="course-info">
        <h4>
          {coursedetail.code}: {coursedetail.title}
        </h4>
        <p>
          <strong>Description: </strong>
          {coursedetail.description}
        </p>
        <p>
          <strong>Category: </strong>
          {coursedetail.category.join(", ")}
        </p>{" "}
        {/* Assuming category is an array of strings */}
        <p>
          <strong>Instructor: </strong>
          {instructorName}
        </p>{" "}
        {/* Display instructor name */}
        <p>
          <strong>Start Date: </strong>
          {formatDate(coursedetail.start_date)}
        </p>
        <p>
          <strong>End Date: </strong>
          {formatDate(coursedetail.end_date)}
        </p>

        <button
          type="button"
          onClick={() => handleDrop(coursedetail._id)}>
          Drop
        </button>
       
      </div>
    </div>
  );
};

const DropCourse = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const [refetchTrigger, setRefetchTrigger] = useState(false);


  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-user-courses/${user.username}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "SET_COURSES", payload: json });
        }
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };
  
    if (user) {
      fetchEnrolledCourses();
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      // existing fetch logic
    };
  
    if (user) {
      fetchEnrolledCourses();
    }
  }, [dispatch, user, refetchTrigger]); // Add refetchTrigger as a dependency
  

  return (
    <div className="course-container">
      <h1>Courses</h1>

      <div className="courses-wrapper">
        <div className="courses">
          {courses &&
            courses.map((coursedetail) => (
              <CourseDetail
                key={coursedetail._id}
                coursedetail={coursedetail}
                setRefetchTrigger={setRefetchTrigger} // Pass down setRefetchTrigger
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DropCourse;
