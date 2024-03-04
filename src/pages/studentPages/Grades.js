import React, { useState, useEffect } from 'react';
import "../../styles/HomePage.css"; // Import CSS for styling
import { useAuthContext } from "../../hooks/useAuthContext";

import '../../index.css';
import '../../styles/App.css';
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
      <ul>
        {grades.map((grade, index) => (
          <li key={index}>
            Course Code: {grade.courseCode} - Grade: {grade.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentGrades;
