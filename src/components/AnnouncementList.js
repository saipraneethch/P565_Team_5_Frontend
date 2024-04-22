import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import SearchComponent from "./SearchComponent";

const AnnouncementList = ({ announcements, onAnnouncementsChange, role }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] =
    useState(announcements);

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAnnouncement(null);
    setIsDeleteConfirmationOpen(false); // Close delete confirmation modal when closing announcement modal
  };

  const handleDeleteClick = (announcementId) => {
    const announcementToDelete = announcements.find((a) => a._id === announcementId);
    setSelectedAnnouncement(announcementToDelete);
    setIsDeleteConfirmationOpen(true); // Open the delete confirmation modal here
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAnnouncement) {
      console.error("No selected announcement to delete.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/announcements/${selectedAnnouncement._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete announcement: ${errorData}`);
      }

      // Update announcements after successful deletion
      const updatedAnnouncements = announcements.filter(
        (announcement) => announcement._id !== selectedAnnouncement._id
      );
      onAnnouncementsChange(updatedAnnouncements);
      closeModal();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredAnnouncements(announcements);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }

  useEffect(() => {
    // Ensure announcements is an array before calling filter
    if (Array.isArray(announcements)) {
      const matchedAnnouncements = searchQuery
        ? announcements.filter((announcement) =>
            announcement.title.toLowerCase().includes(searchQuery)
          )
        : announcements;
      setFilteredAnnouncements(matchedAnnouncements);
    }
  }, [announcements, searchQuery]);

  return (
    <>
      <SearchComponent
        searchText={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
        placeholder="Search announcements..."
      />

      {Array.isArray(filteredAnnouncements) &&
        filteredAnnouncements.map((announcement) => (
          <div key={announcement._id} style={{ position: "relative" }}>
            {role === "instructor" && (
              <div
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "0px",
                  color: "black",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteClick(announcement._id)} // Pass announcement._id, not selectedAnnouncement._id
                >
                  delete
                </span>
              </div>
            )}

            <h3
              className="announcement-title"
              onClick={() => handleAnnouncementClick(announcement)}
            >
              {announcement.title}
            </h3>
            <p>Description: {announcement.description}</p>
            <p>Posted on: {formatDate(announcement.createdAt)}</p>

          </div>
        ))}

      {modalVisible && selectedAnnouncement && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedAnnouncement.title}</h2>
            <button onClick={closeModal}>Close</button>
            {role === "instructor" && (
              <button onClick={handleDeleteConfirm}>Delete</button>
            )}
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}

      {isDeleteConfirmationOpen && selectedAnnouncement && (
        <ConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            handleDeleteCancel();
            closeModal(); // Also close the announcement modal if open
          }}
          message={`Are you sure you want to delete ${selectedAnnouncement.title}?`}
        />
      )}
    </>
  );
};

export default AnnouncementList;
