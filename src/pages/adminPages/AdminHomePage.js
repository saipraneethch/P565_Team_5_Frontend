// First, import React and other dependencies
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/HomePage.css'; // Make sure this path is correct

// Then, register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminHomePage = () => {
  // Data for the histogram (operating systems)
  const operatingSystemsData = {
    labels: ['MacOS', 'Windows', 'Linux', 'Android', 'iOS', 'Chrome OS', 'Unix', 'Other'],
    datasets: [{
      label: 'User Logins by Operating System',
      data: [120, 150, 90, 70, 60, 30, 10, 5], // Example data
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  // Assuming each IP is logged at different times and plotting them on a timeline
  const ipAccessData = {
    labels: ["2023-03-01", "2023-03-02", "2023-03-03", "2023-03-04", "2023-03-05"],
    datasets: [{
      label: 'IP Access Frequency',
      data: [1, 3, 2, 5, 4], // Example data
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }],
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="visualization-box">
        <Bar data={operatingSystemsData} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="visualization-box">
        <h2>International IP Access</h2>
        <Line data={ipAccessData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default AdminHomePage;