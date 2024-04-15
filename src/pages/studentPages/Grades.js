import React, { useState, useEffect } from 'react';
import "../../styles/HomePage.css"; // Import CSS for styling


import '../../index.css';
import '../../styles/App.css';

import '../../styles/Grades.css'; // Import CSS for styling

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Fetch the grades data from the backend and set it using setGrades
    // For now, let's assume the grades are fetched as an array of objects
    // where each object contains courseCode and grade.
    // Example: [{ courseCode: 'CS101', grade: 'A' }, { courseCode: 'MA202', grade: 'B' }]
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    // Placeholder for fetching grades data
    // You should replace this with actual data fetching logic
    const gradesData = [
      { courseCode: 'CS101', grade: 'A' },
      { courseCode: 'MA202', grade: 'B' },
      // Add more grades here
    ];
    setGrades(gradesData);
  };

  return (
    <div>
      <h1>My Grades</h1>
      <div className='grade-container'>
        {grades.map((grade, index) => (
          <div className="grade-details" key={index}>
            <h3>Course Code: {grade.courseCode}</h3>
            <p>Grade: {grade.grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGrades;
