import React, { useState, useEffect } from 'react';

const DisplayContent = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/display-content`); // Adjust this URL to your API endpoint
      const data = await response.json();
      setModules(data);
    };

    fetchModules();
  }, []);

  return (
    <div className="content-container">
      {modules.map((module) => (
        <div key={module._id} className="module">
          <h3>{module.title}</h3>
          {module.fileType.includes('video') ? (
            <video controls src={module.fileUrl} style={{ maxWidth: '100%' }}></video>
          ) : (
            <a href={module.fileUrl} target="_blank" rel="noopener noreferrer">View {module.title}</a>
          )}
        </div>
      ))}
    </div>
  );
  
};

export default DisplayContent;

