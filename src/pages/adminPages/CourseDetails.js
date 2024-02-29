import React, { useEffect } from "react";
// import "../../styles/HomePage.css"; // Import CSS for styling
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { useCoursesContext } from "../../hooks/useCoursesContext";

// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// import { format } from 'date-fns';

import '../../styles/CourseDetails.css'


const CourseDetail = ({ coursedetail }) => {
  // const { dispatch } = useCoursesContext();
  // const { user } = useAuthContext();
  console.log("Single course",coursedetail)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
 

  return (
    <div className="course-details">
      <div className="course-info">
        <h4>{coursedetail.code}: {coursedetail.title}</h4>
        <p><strong>Description: </strong>{coursedetail.description}</p>
        <p><strong>Category: </strong>{coursedetail.category.join(', ')}</p> {/* Assuming category is an array of strings */}
        <p><strong>Instructor: </strong>{coursedetail.instructor}</p>
        <p><strong>Start Date: </strong>{formatDate(coursedetail.start_date)}</p>
        <p><strong>End Date: </strong>{formatDate(coursedetail.end_date)}</p>
        <p><strong>Bibliography: </strong></p>
        
        <ul>
          {coursedetail.bibliography.map((book, index) => (
            <li key={index}>{`${book[0]} by ${book[1]}`}</li> // Adjust depending on your array structure
          ))}
        </ul>
        {/* <p>{formatDistanceToNow(new Date(coursedetail.createdAt), { addSuffix: true })}</p> */}
      </div>
    </div>
  );
}


const CourseDetails = () => {

  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();

  console.log("Course details");
  console.log(courses)

  // Conditional console log to avoid undefined errors
  if (user) {
    console.log(user.username); // Assuming the username is directly on the user object
  } else {
    console.log("User is not defined.");
  }

  useEffect(()=>{
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/v1/coursedetails", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        console.log(json)

        if (response.ok) {
          dispatch({ type: "SET_COURSES", payload: json });
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    }

    if (user){
      fetchCourses()
    }
  },[dispatch,user])

  return (
    <div className="course-container">
      <h1>Course Details</h1>
      <div className="links">
        <Link to="/add-course">Add a new Course</Link>
      </div>
      <div className="courses-wrapper"> 
      <div className="courses">
        
        {courses &&
          courses.map((coursedetail) => (
            <CourseDetail key={coursedetail._id} coursedetail={coursedetail} />
          ))}
      </div>
      {/* For debugging: */}
    {/* <pre>{JSON.stringify(users, null, 2)}</pre> This will print the updated `userdetails` */}
  </div>
    </div>
  );
};

export default CourseDetails;
