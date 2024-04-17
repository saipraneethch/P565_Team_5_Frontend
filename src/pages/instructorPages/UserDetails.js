import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import "../../styles/CourseDetails.css";
import SearchComponent from "../../components/SearchComponent";

const CourseDetail = ({ coursedetail }) => {
  const { user } = useAuthContext();
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State to hold students data

  // Function to toggle the enrolled students section
  const toggleEnrolledStudents = () => {
    setShowEnrolledStudents(prev => !prev);
  };

  // Function to fetch enrolled students for the course
  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch(`/api/v1/coursedetails/enrolled-students/${coursedetail._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const students = await response.json();
      console.log(students)
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
    }
  }, [showEnrolledStudents, coursedetail._id, user.token]); // added dependencies

  return (
    <div className="course-details">
      <div className="course-info">
        <h4 onClick={toggleEnrolledStudents}>
          {coursedetail.code}: {coursedetail.title}
        </h4>
        {showEnrolledStudents && (
          <div className="enrolled-students">
            {/* Render enrolled students here */}
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map(student => (
                <p key={student.id}>{student.first_name} {student.last_name}</p> // Assuming student objects have an id and name
              ))
            ) : (
              <p>No students enrolled.</p>
            )}
          </div>
        )}
      </div>
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
        const response = await fetch(`/api/v1/coursedetails/get-instructor-courses/${user._id}`, {
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
  }, [dispatch, user, user._id, user.token]); // added dependencies




    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      const matchedCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(matchedCourses);
    };

    const handleClear = () => {
      setSearchQuery(''); // Reset the search query
      setFilteredCourses(courses); // Reset the filtered courses to show all courses
    };

    // Effect for initial load, notice the empty dependency array
    useEffect(() => {
      setFilteredCourses(courses);
    }, [courses]);

    return (
      <div className="course-container">
        <h2>Courses by Prof. {user.username}</h2>
        <SearchComponent
          searchText={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onClear={handleClear}
          placeholder="Search courses..."
        />
        <div className="courses-wrapper">
          <div className="courses">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(coursedetail => (
                <CourseDetail key={coursedetail._id} coursedetail={coursedetail} />
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