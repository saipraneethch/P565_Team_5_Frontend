import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import "../styles/Assignments.css";

const SubmittedFilesList = ({ assignmentId , refreshCounter}) => {
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = useAuthContext();
  

  useEffect(() => {
    const fetchSubmittedFiles = async () => {
      setLoading(true);
      try {
        // Fetch submitted files from the backend using GET method
        const response = await fetch(`/api/v1/assignments/get-submitted-files/${assignmentId}/${user.user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch submitted files');
        }
        const data = await response.json();
        setSubmittedFiles(data.submittedFiles);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubmittedFiles();
  }, [assignmentId, refreshCounter,user.user._id,user.token]);
  
  if (loading) {
    return <p>Loading...</p>;
  }
  
  if (errorMessage) {
    return <p>Error: {errorMessage}</p>;
  }
  

  return (
    <div>
      <h2>Submitted Files</h2>
      {submittedFiles.length === 0 ? (
        <p>No files submitted yet.</p>
      ) : (
        <ul>
          {submittedFiles.map((file, index) => (
            <li key={index}>
              {/* Make sure the keys match those sent from the server */}
              <a href={file.submissionContent} target="_blank" rel="noopener noreferrer">
                {new Date(file.submittedOn).toLocaleDateString()} - File
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmittedFilesList;
