import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/StudentHomePage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StudentHomePage = () => {
  const { user } = useAuthContext();
  const student_id = user._id;

  const [gradeDistribution, setGradeDistribution] = useState({
    labels: [],
    hoverLabels: [],
    data: [],
  });

  const [courseStats, setCourseStats] = useState({
    courseList: [],
    highestGrades: [],
    lowestGrades: [],
    meanGrades: [],
    studentGrades: [],
    selectedCourse: null,
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/v1/coursedetails/student/chart-data/${student_id}`);
        const data = await response.json();

        const studentSummary = data.studentSummary;

        // Update grade distribution
        const courseIds = Object.keys(studentSummary);
        const courseLabels = courseIds.map((id) => studentSummary[id].courseTitle);
        const grades = courseIds.map((id) => studentSummary[id].studentGrade);
        const hoverLabels = courseIds.map(
          (id) => `${studentSummary[id].courseCode}: ${studentSummary[id].courseTitle}`
        );

        setGradeDistribution({
          labels: courseLabels,
          hoverLabels,
          data: grades,
        });

        // Update course statistics
        const courseList = courseIds.map((id) => studentSummary[id].courseTitle);
        const studentGrades = courseIds.map((id) => studentSummary[id].studentGrade);
        const highestGrades = courseIds.map((id) => studentSummary[id].maxGrade);
        const lowestGrades = courseIds.map((id) => studentSummary[id].minGrade);
        const meanGrades = courseIds.map((id) => studentSummary[id].averageGrade);

        setCourseStats({
          courseList,
          studentGrades,
          highestGrades,
          lowestGrades,
          meanGrades,
          selectedCourse: courseList[0], // Default to the first course
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentData(); // Fetch data when the component mounts
  }, []); // Fetch data only once on component mount

  const handleCourseChange = (event) => {
    setCourseStats({
      ...courseStats,
      selectedCourse: event.target.value,
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>

      {/* Bar Chart for Grade Distribution */}
      <div className="visualization-box">
        <Bar
          data={{
            labels: gradeDistribution.labels,
            datasets: [
              {
                label: "Grade Distribution",
                data: gradeDistribution.data, // Data for the bar chart
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                ticks: {
                  autoSkip: false, // Ensure all labels are visible
                  maxRotation: 0, // Keep labels horizontal
                  minRotation: 0, // No rotation
                },
              },
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const index = tooltipItem.dataIndex;
                    return gradeDistribution.hoverLabels[index]; // Display course_code: course_title on hover
                  },
                },
              },
              legend: {
                position: "top",
              },
            },
            responsive: true,
          }}
        />
      </div>

      {/* Line Chart for Course Statistics */}
      <div className="visualization-box">
        <label htmlFor="course-select">Select a Course:</label>
        <select
          id="course-select"
          value={courseStats.selectedCourse}
          onChange={handleCourseChange}
        >
          {courseStats.courseList.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>

        <Line
          data={{
            labels: ["Highest", "Lowest", "Mean", "Student"], // Labels for statistics
            datasets: [
              {
                label: courseStats.selectedCourse,
                data: [
                    courseStats.highestGrades[
                      courseStats.courseList.indexOf(courseStats.selectedCourse)
                    ], // Highest grade
                    courseStats.lowestGrades[
                      courseStats.courseList.indexOf(courseStats.selectedCourse)
                    ], // Lowest grade
                    courseStats.meanGrades[
                      courseStats.courseList.indexOf(courseStats.selectedCourse)
                    ], // Mean grade
                    courseStats.studentGrades[
                      courseStats.courseList.indexOf(courseStats.selectedCourse)
                    ], // Student's grade
                  ],
                  backgroundColor: "rgba(255, 206, 86, 0.5)",
                  borderColor: "rgba(255, 206, 86, 1)",
                  borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
            },
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default StudentHomePage;
