import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import "../../styles/CourseDetails.css";
import SearchComponent from "../../components/SearchComponent";

import StudentDetailsModal from "../../components/StudentDetailsModal";

const CourseDetail = ({ coursedetail }) => {
  const { user } = useAuthContext();
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State to hold students data
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Function to toggle the enrolled students section
  const toggleEnrolledStudents = () => {
    setShowEnrolledStudents((prev) => !prev);
  };

  // Function to fetch enrolled students for the course
  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/coursedetails/enrolled-students/${coursedetail._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const students = await response.json();
      console.log(students);
      if (response.ok) {
        setEnrolledStudents(students);
      }
    } catch (error) {
      console.error("Failed to fetch enrolled students:", error);
    }
  };

  // Fetch enrolled students when the section is expanded

  useEffect(() => {
    if (showEnrolledStudents) {
      fetchEnrolledStudents();
    }// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEnrolledStudents, coursedetail._id, user.token]); // added dependencies

  // Function to open modal with student details
  const handleStudentClick = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="course-details">
      <div className="course-info">
        <h4 onClick={toggleEnrolledStudents} style={{ cursor: "pointer" }}>
          {coursedetail.code}: {coursedetail.title}
        </h4>
        {showEnrolledStudents && (
          <div className="enrolled-students">
            {/* Render enrolled students here */}
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((student) => (
                <p
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  style={{ cursor: "pointer" }}
                >
                  {student.first_name} {student.last_name}
                </p>
              ))
            ) : (
              <p>No students enrolled.</p>
            )}
          </div>
        )}
      </div>
      {currentStudent && (
        <StudentDetailsModal
          show={showModal}
          handleClose={handleCloseModal}
          student={currentStudent}
          course_id={coursedetail._id}
        />
      )}
    </div>
  );
};

const EnrolledStudents = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-instructor-courses/${user._id}`,
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
  }, [dispatch, user, user._id, user.token]); // added dependencies

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const matchedCourses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(matchedCourses);
  };

  const handleClear = () => {
    setSearchQuery(""); // Reset the search query
    setFilteredCourses(courses); // Reset the filtered courses to show all courses
  };

  // Effect for initial load, notice the empty dependency array
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  return (
    <div className="course-container">
      <div className="page-title">
        <h2>View Enrolled Users by Course </h2>
      </div>
      <div className="search-form-users">
        <SearchComponent
          searchText={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onClear={handleClear}
          placeholder="Search courses..."
        />
      </div>
      <div className="courses-wrapper">
        <div className="courses">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((coursedetail) => (
              <CourseDetail
                key={coursedetail._id}
                coursedetail={coursedetail}
              />
            ))
          ) : (
            <div className="no-courses-message">No Courses found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudents;