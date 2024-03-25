import React from 'react';
import { Bar } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import 'chart.js/auto'; // Ensure this import is at the top
import '../../styles/HomePage.css';


const InstructorHomePage = () => {
    console.log("Rendering InstructorHomePage");
  // Data for the bar chart
  const enrollmentData = {
    labels: ['Computer Science', 'Data Science', 'Intelligent Systems', 'Human Computer Interaction'],
    datasets: [{
      label: 'Students Enrolled',
      data: [120, 90, 60, 45], // Example data
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1
    }]
  };

  // For the gauge chart, representing a simple average grade range
  // The gauge does not support dual pointers or detailed tooltip interaction as requested
  const averageGradePercentage = 0.75; // Representing 75%

  return (
    <div className="dashboard-container">
      <h1>Instructor Dashboard</h1>
      <div className="visualization-box">
        <Bar data={enrollmentData} />
      </div>
      <div className="visualization-box">
        <GaugeChart id="gauge-chart3" nrOfLevels={30} percent={averageGradePercentage} />
      </div>
    </div>
  );
};

export default InstructorHomePage;
