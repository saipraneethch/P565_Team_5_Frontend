import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/CourseDetails.css";

const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 63) return "D";
  if (percentage >= 60) return "D-";
  return "F";
};

const CourseDetail = ({ coursedetail }) => {
  return (
    <div className="course-details">
      <div className="course-info">
        <Link
          to={`/get-assignment-grades/${coursedetail._doc._id}/${coursedetail._doc.code}`}
        >
          <h4>
            {coursedetail._doc.code}: {coursedetail._doc.title}
          </h4> 
        </Link>
        <p>
          Grade -{" "}
          {coursedetail.grades
            ? `${coursedetail.grades}% (${getLetterGrade(
                coursedetail.grades
              )})`
            : "No grade available"}
        </p>
      </div>
    </div>
  );
};

const StudentGrades = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          `/api/v1/coursedetails/get-course-grades/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const json = await response.json();
        if (response.ok) {
          setCourses(json);
        }
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

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
