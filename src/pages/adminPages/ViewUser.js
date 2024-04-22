import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';

import '../../index.css';
import "../../styles/UserDetails.css";

const ViewUser = () => {
    
  const { user } = useAuthContext();
  const { userId } = useParams(); // If you're passing the user's ID in the URL
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails/${userId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const data = await response.json();
            console.log(data)
            
    
            if (response.ok) {
                setUserDetails(data);
            }
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
      
    };
    

    fetchUserDetails();
  }, [userId,user.token]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="user-details-view">
        <button type="button" onClick={handleBack}>
          Back
        </button>
      <h2>User Details</h2>
      <p><strong>First Name:</strong> {userDetails.first_name}</p>
      <p><strong>Last Name:</strong> {userDetails.last_name}</p>
      <p><strong>Username:</strong> {userDetails.username}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Account Type:</strong> {userDetails.isLocal ? 'Local' : 'External'}</p>
      {/* <p><strong>Avatar:</strong> {userDetails.avatar ? <img src={userDetails.avatar.url} alt="Avatar" /> : 'No avatar'}</p> */}
      <p><strong>Role:</strong> {userDetails.role}</p>
      <p><strong>Verified:</strong> {userDetails.isVerified ? 'Yes' : 'No'}</p>
      <p><strong>Courses:</strong> {userDetails.courses && userDetails.courses.map((course, index) => (
        <span key={index}>{course.courseId}{index < userDetails.courses.length - 1 ? ', ' : ''}</span>
      ))}</p>
      {/* Additional details */}
    </div>
  );
};

export default ViewUser;
