import React, { useEffect } from 'react';
import { useCourseGrades } from './hooks/useCourseGrades';
import { useAuthContext } from '../hooks/useAuthContext';

const CourseGradesPage = () => {
  const { grades, isLoading, error, fetchCourseGrades } = useCourseGrades();

  const {user} =useAuthContext()

  useEffect(() => {
    fetchCourseGrades();
  }, []); // need to add user's authentication information as input

  return (
    <div className="grades-container">
      <h1>Course Grades</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {grades.length > 0 && (
        <ul>
          {grades.map((grade, index) => (
            <li key={index}>
              <span>Course: {grade.course}</span>
              <span>Grade: {grade.grade}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseGradesPage;
