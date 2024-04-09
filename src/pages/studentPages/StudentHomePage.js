import React from 'react';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import 'chart.js/auto';
import '../../styles/StudentHomePage.css'; // Adjust the path to your new CSS file


// Import CSS as necessary

const StudentHomePage = () => {
    console.log("Rendering StudentHomePage");
  // Data for the line chart
  const studentEnrollmentData = {
    labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Students Enrolled",
        data: [120, 150, 180, 170, 190, 210, 240], // Example data
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Data for the gauge chart
  const averageGrade = 0.75; // Representing 75% as a fraction of 1

   return (
    <div className="student-dashboard-container">
      <h1 className="student-dashboard-heading">Student Dashboard</h1>
      <div className="chart-container">
        <Line data={studentEnrollmentData} />
      </div>
      <div className="chart-container gauge-chart-container">
        <GaugeChart id="gauge-chart2" nrOfLevels={20} percent={averageGrade} />
      </div>
    </div>
  );
};

export default StudentHomePage;