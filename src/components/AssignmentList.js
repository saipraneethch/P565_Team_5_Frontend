import React from 'react';

const AssignmentList = ({ assignments, formatDateWithTime, onEdit, onDelete }) => {
  // Function to handle file download
  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileUrl.split('/').pop(); // Extracts the file name for the 'download' attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  
  

  return (
    <>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: '0px', top: '0px' }}>
                <span className="material-symbols-outlined" style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => onEdit(assignment)}>edit</span>
                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }} onClick={() => onDelete(assignment._id)}>delete</span>
              </div>
              <h3>{assignment.title}</h3>
              <p>Description: {assignment.description}</p>
              <p>Start Date: {formatDateWithTime(assignment.startDate)}</p>
              <p>Due Date: {formatDateWithTime(assignment.dueDate)}</p>
              {assignment.fileUrl && (
                <button onClick={() => handleDownload(assignment.fileUrl, `${assignment.title}-material`)}>Download Assignment Material</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments created yet.</p>
      )}
    </>
  );
};

export default AssignmentList;
