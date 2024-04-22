import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Plugin for data labels
import "../../styles/AdminHomePage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin for data labels
);

const AdminHomePage = () => {
  const [courseEnrollment, setCourseEnrollment] = useState({
    labels: [],
    hoverLabels: [],
    data: [],
  });

  const [userRoles, setUserRoles] = useState({
    labels: [],
    data: [],
  });

  const [totalUsers, setTotalUsers] = useState(0); // State to store the total number of users

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/admin/chart-data`);
        const data = await response.json();

        // Labels for the bar chart
        const courseLabels = Object.values(data.courseSummary).map(
          (course) => course.courseCode // Display course_code as label
        );

        // Hover labels for the tooltip
        const hoverLabels = Object.values(data.courseSummary).map(
          (course) => `${course.courseCode}: ${course.courseTitle}` // Display course_code: course_title on hover
        );

        const enrollments = Object.values(data.courseSummary).map(
          (course) => course.numberOfUsersEnrolled
        );

        setCourseEnrollment({
          labels: courseLabels,
          hoverLabels,
          data: enrollments,
        });

        const userRoleLabels = Object.keys(data.userSummary);
        const roleCounts = Object.values(data.userSummary);

        setUserRoles({
          labels: userRoleLabels,
          data: roleCounts,
        });

        // Calculate the total number of users
        const total = roleCounts.reduce((sum, count) => sum + count, 0);
        setTotalUsers(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch the data when the component mounts
  }, []); // Run once on component mount

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: '80px', padding: "20px" }}>
        {/* Bar Chart for Course Enrollments */}
        <div className="visualization-box" style={{ width: "45%" }}>
          <Bar
            data={{
              labels: courseEnrollment.labels, // Display course_code as label
              datasets: [
                {
                  label: "Enrollments by Course",
                  data: courseEnrollment.data,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",
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
                tooltip: {
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex;
                      return courseEnrollment.hoverLabels[index]; // Display course_code: course_title on hover
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

        {/* Pie Chart for User Roles Distribution */}
        <div className="visualization-box" style={{ width: "45%" }}>
          <div>Total Users: {totalUsers}</div> {/* Display total number of users */}

          <Pie
            data={{
              labels: userRoles.labels,
              datasets: [
                {
                  label: "User Roles",
                  data: userRoles.data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  formatter: (value) => {
                    const percentage = ((value / totalUsers) * 100).toFixed(2);
                    return `${percentage}%`; // Display percentage on the pie chart
                  },
                  color: "#fff",
                  font: {
                    weight: "bold",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const role = tooltipItem.label;
                      const count = tooltipItem.raw;
                      const percentage = ((count / totalUsers) * 100).toFixed(2); // Tooltip with percentage
                      return `${role}: ${count} (${percentage}%)`;
                    },
                  },
                },
                legend: {
                  position: "right",
                },
              },
              maintainAspectRatio: false, // Control pie chart sizing
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
