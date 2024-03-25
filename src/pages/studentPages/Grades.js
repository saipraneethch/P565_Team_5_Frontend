import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCoursesContext } from '../../hooks/useCoursesContext';
import GaugeChart from 'react-gauge-chart';
import '../../styles/Grades.css'; // Import CSS for styling

const CourseDetail = ({ coursedetail, gradeInfo }) => {
  // CourseDetail now expects a coursedetail object that includes instructorName
  return (
    <div className="grade-details">
      <h3>Course: {coursedetail.title}</h3>
      <p><strong>Instructor:</strong> {coursedetail.instructorName}</p>
      <p><strong>Grade:</strong> {gradeInfo.grade}</p>
      <GaugeChart
        id={`gauge-chart-${coursedetail._id}`}
        nrOfLevels={20}
        percent={gradeInfo.score / 4} // Assuming score is out of 4
        arcPadding={0.1}
        cornerRadius={3}
        textColor={"#333"}
        arcWidth={0.3}
        needleColor={"#333"}
        needleBaseColor={"#333"}
        needleBaseSize={10}
        animate={true}
      />
    </div>
  );
};

const StudentGrades = () => {
  const { courses, dispatch } = useCoursesContext();
  const { user } = useAuthContext();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Fetch logic for courses and grades goes here
    // Fetch instructor names for each course as part of the courses data
    const fetchCoursesAndInstructors = async () => {
      // Assuming you have a way to fetch the full details including instructor names
      // This is a placeholder for fetching logic
      const updatedCourses = await Promise.all(courses.map(async (course) => {
        const response = await fetch(`/api/v1/coursedetails/get-single-instructor/${course.instructor}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        return { ...course, instructorName: `${data.first_name} ${data.last_name}` };
      }));
      // Update the courses in the context or local state
      dispatch({ type: "SET_COURSES", payload: updatedCourses });
    };

    if (user) {
      fetchCoursesAndInstructors();
    }
  }, [user, dispatch, courses]);

  // Dummy function to get grade info for a course
  const getGradeInfoForCourse = (courseCode) => {
    return grades.find(grade => grade.courseCode === courseCode) || {};
  };

  return (
    <div className="grade-page-container">
      
      <div className='grade-container'>
        {courses && courses.map((coursedetail) => (
          <CourseDetail
            key={coursedetail._id}
            coursedetail={coursedetail}
            gradeInfo={getGradeInfoForCourse(coursedetail.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentGrades;
