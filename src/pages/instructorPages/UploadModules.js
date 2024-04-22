import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';

const UploadContent = () => {

  const { course_id } = useParams();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadResponse, setUploadResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const user = useAuthContext();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    let resourceType = 'auto'; 
    const fileType = file.type.split('/')[0]; // 'video' or 'application' etc.
    console.log("FileType:",fileType)

    if (fileType === 'video') {
        resourceType = 'video';
    } else if (['application', 'text'].includes(fileType)) {
        resourceType = 'auto';
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', fileType === 'video' ? 'videos_preset' : 'ppt_preset');

    const cloudName = 'dujhzpily';
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const response = await fetch(api, {
      method: 'POST',
      body: data
    });
    console.log("Response url: ",response)

    if (response.ok) {
        const jsonResponse = await response.json();
        
        return jsonResponse.url; // Assuming the response contains the URL of the uploaded file
      } else {
        // Handle errors here
        const errorResponse = await response.json();
        throw new Error(errorResponse.error.message);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadResponse('');
    setErrorMessage('');

    if (!file) {
      console.error('No file selected');
      return;
    }
    setLoading(true);

    try {
        const fileUrl = await uploadFile(file);
        const fileType = file.type.split('/')[0]; 
        console.log(fileUrl)
        
        // Here, send the fileUrl and title to your own backend server
        const backendResponse = await fetch('${process.env.REACT_APP_API_URL}/api/v1/coursedetails/upload-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Assuming you handle authentication
          },
          body: JSON.stringify({ title,course:course_id, fileUrl: fileUrl , fileType: fileType })
        });
  
        // Check if the backend request is successful
        console.log("backendResponse",backendResponse)
        if (backendResponse.ok) {
          setUploadResponse('Content uploaded successfully!');
        } else {
          const errorResponse = await backendResponse.json();
          throw new Error(errorResponse.error);
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
        setTitle('');
        setFile(null);
        // navigate(-1);
      }
    };

  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <div className="container mt-5">
      <h2>Upload Content</h2>
      {loading && <p>Uploading...</p>}
      {uploadResponse && <p>{uploadResponse}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input 
            type="text" 
            className="form-control" 
            id="title" 
            value={title} 
            onChange={handleTitleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Content (PPT, Video, PDF)</label>
          <input 
            type="file" 
            className="form-control" 
            id="file" 
            onChange={handleFileChange} 
            accept=".ppt,.pptx,video/*,.pdf" 
            required 
          />
        </div>
        <button onClick={handleCancel} className="button">Cancel</button>
        <button type="submit" className="button">Upload</button>
      </form>
    </div>
  );
};

export default UploadContent;
