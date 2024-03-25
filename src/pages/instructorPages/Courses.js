import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useCoursesContext } from "../../hooks/useCoursesContext";

import "../../styles/CourseDetails.css";
import SearchComponent from "../../components/SearchComponent";

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
      <Link to={{
  pathname: `/selected-course-assignments/${coursedetail._id}/${user._id}/${coursedetail.code}`,
 
}}>
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

const AssignedCourses = () => {
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
  }, [dispatch, user]);

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

export default AssignedCourses;
