import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import "../../styles/CourseDetails.css";
import "../../styles/ModalStyles.css";

const CourseDetail = ({ coursedetail, onCourseClick }) => {
  const [instructorName, setInstructorName] = useState("");
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
        } else {
          setInstructorName("Unknown");
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

  return (
    <div className="course-details" onClick={() => onCourseClick(coursedetail, instructorName)}>
      <h4>{coursedetail.code}: {coursedetail.title}</h4>
      <p>Instructor: {instructorName}</p> {/* Displaying the instructor's name here */}
    </div>
  );
};

const EnrolledCourses = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [instructorName, setInstructorName] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`/api/v1/coursedetails/get-user-courses/${user.username}`, {
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

  const handleCourseClick = (course, instructor) => {
    setSelectedCourse(course);
    setInstructorName(instructor);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const assignments = [
    { name: "Assignment 1", dueDate: "2024-04-10" },
    { name: "Assignment 2", dueDate: "2024-05-15" },
    { name: "Assignment 3", dueDate: "2024-06-20" },
    { name: "Assignment 4", dueDate: "2024-07-25" },
  ];

  return (
    <div className="course-container">
      <h1>Courses</h1>
      <div className="courses-wrapper">
        {courses.map((coursedetail) => (
          <CourseDetail
            key={coursedetail._id}
            coursedetail={coursedetail}
            onCourseClick={handleCourseClick}
          />
        ))}
      </div>

      {selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{selectedCourse.title}</h2>
            <p><strong>Description:</strong> {selectedCourse.description}</p>
            <p><strong>Instructor:</strong> {instructorName}</p>
            <p><strong>Start Date:</strong> {formatDate(selectedCourse.start_date)}</p>
            <p><strong>End Date:</strong> {formatDate(selectedCourse.end_date)}</p>
            <h3>Assignments</h3>
            <ul>
              {assignments.map((assignment, index) => (
                <li key={index}>{assignment.name} - Due: {assignment.dueDate}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
