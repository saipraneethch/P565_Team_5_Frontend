// EditAssignmentModal.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../styles/Assignments.css";

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().substring(0, 16);
};

const EditAssignmentModal = ({ assignment, onSave, onClose }) => {
  useEffect(() => {
    if (assignment.startDate && assignment.dueDate) {
      setEditedAssignment({
        ...assignment,
        startDate: formatDateForInput(assignment.startDate),
        dueDate: formatDateForInput(assignment.dueDate),
      });
    } else {
      setEditedAssignment(assignment);
    }
  }, [assignment]);

  const [editedAssignment, setEditedAssignment] = useState({
    ...assignment,
    startDate: assignment.startDate
      ? formatDateForInput(assignment.startDate)
      : "",
    dueDate: assignment.dueDate ? formatDateForInput(assignment.dueDate) : "",
  });
  const [fileUrl, setFileUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let tempErrors = {};
    const startDate = new Date(editedAssignment.startDate);
    const dueDate = new Date(editedAssignment.dueDate);

    // if (startDate < new Date().setHours(0, 0, 0, 0)) {
    //   tempErrors.startDate = "Start date should be today or later.";
    // }

    if (dueDate <= startDate) {
      tempErrors.dueDate = "Due date should be after the start date.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFileUrl(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('title', editedAssignment.title);
    formData.append('description', editedAssignment.description);
    formData.append('startDate', editedAssignment.startDate);
    formData.append('dueDate', editedAssignment.dueDate);

    if (fileUrl) {
      formData.append("file", fileUrl, fileUrl.name);
    }

    onSave(formData, editedAssignment._id);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Assignment</h2>
        <form onSubmit={handleSubmit} className="edit-assignment-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editedAssignment.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editedAssignment.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date and Time</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={editedAssignment.startDate || ""}
              onChange={handleChange}
              required
            />
            {errors.startDate && (
              <div className="error">{errors.startDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date and Time</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={editedAssignment.dueDate || ""}
              onChange={handleChange}
              required
            />
            {errors.dueDate && <div className="error">{errors.dueDate}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="fileUrl">Assignment Material (optional)</label>
            <input
              type="fileUrl"
              id="fileUrl"
              name="fileUrl"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="button cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;
