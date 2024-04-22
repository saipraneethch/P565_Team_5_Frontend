import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/Assignments.css";
import SubmittedFilesList from "../../components/SubmittedFilesList";

const SubmissionForm = ({ assignmentId }) => {
  const [files, setFiles] = useState([]);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0); // Add this line to track submissions
  const navigate = useNavigate();
  const user = useAuthContext();

  const assignment_id = useParams();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles);
  };

  const handleAddFiles = () => {
    setStagedFiles([...stagedFiles, ...files]);
    setFiles([]);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // Reset the file input field
    }
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedStagedFiles = stagedFiles.filter(
      (file) => file !== fileToRemove
    );
    setStagedFiles(updatedStagedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadResponse("");
    setErrorMessage("");

    if (stagedFiles.length === 0) {
      console.error("No file selected");
      setLoading(false);
      return;
    }

    try {
      for (const file of stagedFiles) {
        const fileUrl = await uploadFile(file);
        const fileType = file.type.split("/")[0];

        // Here, send the fileUrl and title to your own backend server
        const backendResponse = await fetch(
          "${process.env.REACT_APP_API_URL}/api/v1/assignments/submit-assignment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`, // Assuming you handle authentication
            },
            body: JSON.stringify({
              assignment_id: assignment_id,
              user: user.user._id,
              fileUrl: fileUrl,
              fileType: fileType,
            }),
          }
        );

        // Check if the backend request is successful
        if (!backendResponse.ok) {
          const errorResponse = await backendResponse.json();
          throw new Error(errorResponse.error);
        }
      }
      setUploadResponse("Content uploaded successfully!");
      setRefreshCounter((prev) => prev + 1); // Increment to trigger re-fetch
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      setStagedFiles([]);
      // navigate(-1);
    }
  };

  const uploadFile = async (file) => {
    let resourceType = "auto";
    const fileType = file.type.split("/")[0]; // 'video' or 'application' etc.

    if (fileType === "video") {
      resourceType = "video";
    } else if (["application", "text"].includes(fileType)) {
      resourceType = "auto";
    }

    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      fileType === "video" ? "videos_preset" : "ppt_preset"
    );

    const cloudName = "dujhzpily";
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(api, {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.url; // Assuming the response contains the URL of the uploaded file
    } else {
      // Handle errors here
      const errorResponse = await response.json();
      throw new Error(errorResponse.error.message);
    }
  };

  const handleCancel = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  return (
    <div>
        <button type="button" onClick={handleCancel}>
          Back
        </button>
        <p>Please ensure to submit all files collectively. Only the most recent submission will be considered for evaluation.</p>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} id="fileInput" />
        <button
          type="button"
          onClick={handleAddFiles}
          disabled={files.length === 0 || loading}
          className={files.length === 0 || loading ? "disabled-button" : ""}
        >
          Add
        </button>
  
        <div>
          {stagedFiles.map((file, index) => (
            <div key={index}>
              <span>{file.name}</span>
              <button type="button" onClick={() => handleRemoveFile(file)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={stagedFiles.length === 0 || loading}
          className={stagedFiles.length === 0 || loading ? "disabled-button" : ""}
        >
          Submit
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        {loading && <p>Uploading...</p>}
        {errorMessage && <p>Error: {errorMessage}</p>}
        {uploadResponse && <p>{uploadResponse}</p>}
      </form>
      <div>
        <SubmittedFilesList assignmentId={assignment_id.assignment_id} refreshCounter={refreshCounter} />
      </div>
    </div>
  );
  
};

export default SubmissionForm;
