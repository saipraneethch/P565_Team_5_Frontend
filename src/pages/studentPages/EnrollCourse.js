import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useCoursesContext } from "../../hooks/useCoursesContext";
import { useUsersContext } from "../../hooks/useUserContext";

import "../../styles/CourseDetails.css";

const CourseDetail = ({ coursedetail }) => {
  const [instructorName, setInstructorName] = useState(""); // State to store instructor name
  const { user } = useAuthContext();
  const { dispatch } = useUsersContext();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkUserEnrollment = async () => {
      try {
        // API call to check if the user is enrolled in the course
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/userdetails/check-enrollment/${user.username}/${coursedetail._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to check enrollment status");
        }
        const { enrolled } = await response.json();
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };

    if (user && coursedetail._id) {
      checkUserEnrollment();
    }
  }, [user, coursedetail._id]);

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

  const handleEnroll = async (courseId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      console.log(user);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/userdetails/${user.username}/enroll`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ courseId: courseId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not enroll in the course");
      }

      // Assuming the backend returns the updated user data
      const updatedUser = await response.json();
      // Dispatch an action to update the user in your context
      dispatch({ type: "UPDATE_USER", payload: updatedUser });

      // Show success message
      setShowSuccessMessage(true);

      // Optionally, hide the message after some time
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to enroll in course:", error);
    }
  };

  return (
    <div className="course-details">
      {showSuccessMessage && (
        <div className="success-message">
          You have enrolled in the course successfully!
        </div>
      )}
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
          onClick={() => handleEnroll(coursedetail._id)}
          disabled={isEnrolled}
          className={`enroll-button ${isEnrolled ? "enrolled" : ""}`}
        >
          {isEnrolled ? "Enrolled" : "Enroll"}
        </button>
      </div>
    </div>
  );
};

const EnrollCourse = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "SET_COURSES", payload: json });
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [dispatch, user]);

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
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;
