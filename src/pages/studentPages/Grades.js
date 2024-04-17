import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/CourseDetails.css";
import '../../index.css';
import '../../styles/App.css';
import '../../styles/Grades.css'; 
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCoursesContext } from '../../hooks/useCoursesContext';

const CourseDetail = ({ coursedetail, gradeInfo }) => {
  // CourseDetail now expects a coursedetail object that includes instructorName
  return (
    <div className="course-details">
      <div className="course-info">
        {/* <Link
          to={{
            pathname: `/enrolled-course-assignments/${coursedetail._id}/${coursedetail.instructor}/${coursedetail.code}`,
          }}
        > */}
          <h4>
            {coursedetail.code}: {coursedetail.title}
          </h4>
        {/* </Link> */}
       
      </div>
    </div>
  );
};



const StudentGrades = () => {
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

export default StudentGrades;
