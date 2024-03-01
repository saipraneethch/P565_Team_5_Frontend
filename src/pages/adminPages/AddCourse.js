import React, { useState } from 'react';
import '../../index.css';
import '../../styles/AddCourse.css'; // Import the CSS styles

import Select from 'react-select';

//import 'react-select/dist/react-select.css';


const AddCourse = () => {
  const [course, setCourse] = useState({
    code: '',
    title: '',
    description: '',
    category: [],
    instructor: '',
    startDate: '',
    endDate: '',
    bibliography: []
  });

  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'arts', label: 'Arts' },
    { value: 'music', label: 'Music' },
    { value: 'computer science', label: 'Computer Science' },
    { value: 'data science', label: 'Data Science' },
    // ... add other categories
  ];

  const handleCategoryChange = (selectedOptions) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      category: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };


  const handleChange = (e) => {
    
      //setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
    
  };
 

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Logic to send course data to the server
    console.log(course);

    await fetch('api/v1/coursedetails/add-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
  };

  return (
    <div className="main-content">
      <div className="form-container">
        <h2>Add New Course</h2>
        <form className="form" onSubmit={handleSubmit}>
          {/* Course Code */}
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
          {/* Title */}
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
          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
            />
          </div>
          {/* Category */}
          <div className="form-group">
  <label htmlFor="category">Category:</label>
  <Select
        isMulti
        name="category"
        options={categoryOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleCategoryChange}
        value={categoryOptions.filter(option => course.category.includes(option.value))}
      />
    
    
</div>
          {/* Instructor ID */}
          <div className="form-group">
            <label htmlFor="instructor">Instructor:</label>
            <input
              id="instructor"
              name="instructor"
              type="text"
              value={course.instructor}
              onChange={handleChange}
            />
          </div>
          {/* Start Date */}
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
          {/* End Date */}
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
          {/* Bibliography */}
          <div className="form-group">
            <label htmlFor="bibliography">Bibliography:</label>
            <input
              id="bibliography"
              name="bibliography"
              type="text"
              value={course.bibliography}
              onChange={handleChange}
              placeholder="Separate items with commas"
            />
          </div>
          {/* Submit button */}
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
