import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Announcements.css";
import { toast } from 'react-toastify';

const CreateAnnouncement = () => {
  const { course_id, instructor_id } = useParams();
 
  
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
   
  });
 
  // const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setAnnouncement({ ...announcement, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();


 

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/announcements/create-announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: announcement.title,
            description: announcement.description,
            course: course_id,
            instructor: instructor_id
          }),
  
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Announcement created successfully!");
      navigate(-1); // Navigate back
    } else {
      toast.error(`Failed to create announcement: ${data.message}`);
    }
  } catch (error) {
    toast.error(`Error creating new announcement: ${error}`);
  }
};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <button onClick={handleBack} className="button back-button">
          Back
        </button>
      </div>
      <h2>Make a new Announcement</h2>
      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={announcement.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={announcement.description} onChange={handleChange} required />
        </div>
        
        <button type="submit" className="button submit-button">Create Announcement</button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
