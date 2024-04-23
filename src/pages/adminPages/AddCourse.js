import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import "../../styles/AddCourse.css"; // Import the CSS styles

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";

const AddCourse = () => {
  const { dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    code: "",
    title: "",
    description: "",
    category: [],
    instructor: "",
    start_date: "",
    end_date: "",
    bibliography: [{ title: "", author: "" }],
  });

  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [error, setError] = useState(null);

  const categoryOptions = [
    { value: "business", label: "Business" },
    { value: "engineering", label: "Engineering" },
    { value: "arts", label: "Arts" },
    { value: "music", label: "Music" },
    { value: "computer science", label: "Computer Science" },
    { value: "data science", label: "Data Science" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "science", label: "Science" },
    { value: "finance", label: "Finance" },
    { value: "technology", label: "Technology" },
    { value: "environment", label: "Environment" },
    { value: "agriculture", label: "Agriculture" },
    { value: "architecture", label: "Architecture" },
    { value: "hospitality", label: "Hospitality" },
    { value: "law", label: "Law" },
    { value: "media", label: "Media" },
    { value: "philosophy", label: "Philosophy" },
    { value: "psychology", label: "Psychology" },
    { value: "sociology", label: "Sociology" },
    { value: "sports", label: "Sports" },
    { value: "math", label: "Math" },
    { value: "english", label: "English" },
    // Add more categories as needed
];

  const handleCategoryChange = (selectedOptions) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      category: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleInstructorChange = (selectedOption) => {
    setCourse({
      ...course,
      instructor: selectedOption ? selectedOption.value : "",
    });
    setSelectedInstructor(selectedOption);
  };

  const handleBibliographyChange = (index, field, value) => {
    const newBibliography = [...course.bibliography];
    newBibliography[index][field] = value;
    setCourse({ ...course, bibliography: newBibliography });
  };

  const addBibliographyField = () => {
    setCourse({
      ...course,
      bibliography: [...course.bibliography, { title: "", author: "" }],
    });
  };

  const removeBibliographyField = (index) => {
    const newBibliography = [...course.bibliography];
    newBibliography.splice(index, 1);
    setCourse({ ...course, bibliography: newBibliography });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    // Ensure the end date is greater than the start date
  if (new Date(course.end_date) <= new Date(course.start_date)) {
    setError("End date must be greater than start date.");
    return;
  }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/add-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      toast.error("Failed to add course");
    } else {
      setCourse({
        code: "",
        title: "",
        description: "",
        category: [],
        instructor: "",
        start_date: "",
        end_date: "",
        bibliography: [{ title: "", author: "" }],
      });
      setError(null);
      setSelectedInstructor(null); 
      dispatch({ type: "CREATE_COURSE", payload: json });
      toast.success("Course added successfully");
    }
  };

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/get-instructors/all-instructors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to fetch instructors: ${errorData}`);
        }

        const data = await response.json();
        console.log("instructors",data)
        const instructorOptions = data.map((instructor) => ({
          value: instructor._id,
          label: `${instructor.first_name} ${instructor.last_name}`,
        }));
        setInstructors(instructorOptions);
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };

    if (user && user.token) {
      fetchInstructors();
    }
  }, [user, dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="main-content">
      <div className="form-container">
        {/* Back button */}
        <button type="button" onClick={handleBack}>
          Back
        </button>
        <h2>Add New Course</h2>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label htmlFor="code">Course Code:</label>
            <input
              id="code"
              name="code"
              type="text"
              value={course.code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              value={course.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <Select
              isMulti
              name="category"
              options={categoryOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleCategoryChange}
              value={categoryOptions.filter((option) =>
                course.category.includes(option.value)
              )}
            />
          </div>
          <div className="form-group">
            <label htmlFor="instructor">Instructor:</label>
            <Select
              id="instructor"
              options={instructors}
              onChange={handleInstructorChange}
              value={selectedInstructor}
              isClearable={true}
              isSearchable={true}
              placeholder="Select an instructor"
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_date">Start Date:</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={course.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_date">End Date:</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={course.end_date}
              onChange={handleChange}
            />
          </div>
          <label>Bibliography:</label>
          {course.bibliography.map((bibEntry, index) => (
            <div className="bibliography-group" key={index}>
              <div className="form-group">
                <label htmlFor={`title-${index}`}>Title:</label>
                <input
                  id={`title-${index}`}
                  name={`title-${index}`}
                  type="text"
                  value={bibEntry.title}
                  onChange={(e) =>
                    handleBibliographyChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={`author-${index}`}>Author:</label>
                <input
                  id={`author-${index}`}
                  name={`author-${index}`}
                  type="text"
                  value={bibEntry.author}
                  onChange={(e) =>
                    handleBibliographyChange(index, "author", e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeBibliographyField(index)}
              >
                Remove
              </button>
              <button type="button" onClick={addBibliographyField}>
                Add Another Bibliography
              </button>
            </div>
          ))}

          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
