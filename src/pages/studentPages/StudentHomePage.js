import React from 'react';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import 'chart.js/auto'; // Ensure this import is at the top
import '../../styles/HomePage.css';


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
    <div className="student-home-container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      <h1>Student Dashboard</h1>
      <div style={{ width: '50%' }}>
        <Line data={studentEnrollmentData} />
      </div>
      <div style={{ width: '50%' }}>
        <GaugeChart id="gauge-chart2" nrOfLevels={20} percent={averageGrade} />
      </div>
    </div>
  );
};

export default StudentHomePage;