import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { useNavigate } from 'react-router-dom';

import ConfirmationModal from '../../components/ConfirmationModal';
import CourseEditModal from "../../components/CourseEditModal";
import SearchComponent from "../../components/SearchComponent";


import '../../styles/CourseDetails.css'

const CourseDetail = ({ coursedetail ,refreshCourses}) => {
  const [instructorName, setInstructorName] = useState(""); // State to store instructor name
  const { user } = useAuthContext();
  const { dispatch } = useCoursesContext();
  const navigate = useNavigate();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchInstructorName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-single-instructor/${coursedetail.instructor}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleView = (courseId) => {
    // Navigate to the course view page, passing the courseId as parameter or state
    // Example using react-router-dom's useNavigate hook
    navigate(`/courses/view/${courseId}`);
  };

  const handleUpdate = () => {
    // Show the modal by setting isEditing to true
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmationOpen(true); // Open the delete confirmation modal
  };


  const handleDeleteConfirm = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/${coursedetail._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        dispatch({ type: "DELETE_COURSE", payload: coursedetail._id });
        setIsDeleteConfirmationOpen(false); // Optionally close the modal and refresh or navigate away
      } else {
        alert("Failed to delete the course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false); // Close the modal without deleting
  };



  const handleCloseModal = () => {
    // Hide the modal
    setIsEditing(false);
  };


  return (
    <div className="course-details">
      <div className="course-actions">

<span className="material-symbols-outlined view-icon" onClick={() => handleView(coursedetail._id)}>visibility</span>
    <span className="material-symbols-outlined edit-icon" onClick={handleUpdate}>edit</span>
    <span className="material-symbols-outlined delete-icon" onClick={() => handleDelete(coursedetail._id)}>delete</span>
</div>
      <div className="course-info">
        <h4>{coursedetail.code}: {coursedetail.title}</h4>
        <p><strong>Description: </strong>{coursedetail.description}</p>
        <p><strong>Category: </strong>{coursedetail.category.join(', ')}</p> {/* Assuming category is an array of strings */}
        <p><strong>Instructor: </strong>{instructorName}</p> {/* Display instructor name */}
        <p><strong>Start Date: </strong>{formatDate(coursedetail.start_date)}</p>
        <p><strong>End Date: </strong>{formatDate(coursedetail.end_date)}</p>
        {isEditing && <CourseEditModal selectedcourse={coursedetail} closeModal={handleCloseModal} refreshCourses={refreshCourses}/>}

{isDeleteConfirmationOpen && (
  <ConfirmationModal
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
    message={`Are you sure you want to delete ${coursedetail.title}?`}
  />
)}
      </div>
    </div>
  );
}

const CourseDetails = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const handleAddCourse = () => {
    navigate("/add-course");
};

    const fetchCourses = async () => {
      try {
        const response = await fetch("${process.env.REACT_APP_API_URL}/api/v1/coursedetails", {
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


  useEffect(() => {
    if (user) {
      fetchCourses();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredCourses([]);
  };

  useEffect(() => {
    const matchedCourses = searchQuery
      ? courses.filter(
          (course) =>
            course.code.toLowerCase().includes(searchQuery) ||
            course.title.toLowerCase().includes(searchQuery)
        )
      : courses;
    setFilteredCourses(matchedCourses);
  }, [courses, searchQuery]);

  return (
    <div className="course-container">
      <div className="course-header">
      <h2>Course Details</h2>
      <div className="links">
            <button onClick={handleAddCourse}>Add a new Course</button>
        </div>
</div>
<SearchComponent
          searchText={searchQuery}
          onSearchSubmit={handleSearchSubmit}
          onSearchChange={handleSearchChange}
          onClear={handleClear}
          placeholder="Search courses..."
        />

      <div className="courses-wrapper"> 
        <div className="courses">
          {courses && filteredCourses.map((coursedetail) => (
            <CourseDetail key={coursedetail._id} coursedetail={coursedetail} refreshCourses={fetchCourses} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
