import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useCoursesContext } from "../../hooks/useCoursesContext";

import "../../styles/CourseDetails.css";

const CourseDetail = ({ coursedetail }) => {
  const [instructorName, setInstructorName] = useState(""); // State to store instructor name
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInstructorName = async () => {
      try {
        const response = await fetch(
          `/api/v1/coursedetails/get-single-instructor/${coursedetail.instructor}`,
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

  return (
    <div className="course-details">
      <div className="course-info">
        <Link
          to={{
            pathname: `/enrolled-course-assignments/${coursedetail._id}/${coursedetail.instructor}/${coursedetail.code}`,
          }}
        >
          <h4>
            {coursedetail.code}: {coursedetail.title}
          </h4>
        </Link>
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
      </div>
    </div>
  );
};

const EnrolledCourses = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          `/api/v1/coursedetails/get-user-courses/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
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

export default EnrolledCourses;
