import React from 'react';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MyImage from '../landingimg.jpg';
const HomePage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleExploreClick = () => {
    navigate('/login'); // Navigate to /login on button click
  };
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="homepage-text">
          <h2>Wisdom Arena</h2>
          <h3>A Learning Management System</h3>
          <p>
          Unlock your learning potential and soar with engaging courses, interactive tools, and seamless collaboration in this dynamic learning management system.
          </p>
          <button className="homepage-explore-btn" onClick={handleExploreClick}>
          EXPLORE
        </button>
        </div>
        <div className="homepage-image">
          <img src={MyImage} alt="Learning Management System" className="landing-image" />
        </div>
      </div>
    </div>
  );
};
export default HomePage;