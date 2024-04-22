// Import React and useState hook
import React, { useState, useEffect } from "react";

// Import the CSS file for styling
import "../styles/displayContent.css";
import ConfirmationModal from './ConfirmationModal';
import SearchComponent from "./SearchComponent";

const ModuleList = ({ modules, onModulesChange, role }) => {
  // State to control the visibility and content of the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModules, setFilteredModules] = useState(modules);
 
  
  const handleModuleClick = (module) => {
    // Set the clicked module as selected and show the modal
    setSelectedModule(module);
    setModalVisible(true);
  };

  const closeModal = () => {
    // Hide the modal
    setModalVisible(false);
    setSelectedModule(null);
  };
  
  const handleDownload = (url, filename) => {
    // Directly append 'fl_attachment' to Cloudinary URL
    const downloadUrl = `${url}?fl_attachment=${encodeURIComponent(filename)}`;
    
    // Use fetch to get the file, then create a blob URL to download
    fetch(downloadUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.setAttribute('download', filename); // Set the file name for download
        document.body.appendChild(downloadLink); // Append to the document
        downloadLink.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(downloadLink); // Remove the link from the document
        window.URL.revokeObjectURL(blobUrl); // Clean up the blob URL
      })
      .catch(error => console.error('Download error:', error));
  };
  
  const handleDeleteClick = (moduleId) => {
    

    
    setIsDeleteConfirmationOpen(true);
  };


  const handleDeleteConfirm = async () => {
  // This should probably be set outside of this function, maybe passed in as a prop
  // or derived from selectedModule state.
  const moduleIdToDelete = selectedModule._id;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/coursedetails/delete-content/${moduleIdToDelete}`, {
      method: 'DELETE', // This should be a DELETE request
      headers: {
        'Content-Type': 'application/json',
        
      },
    });

    if (!response.ok) {
      // It's a good idea to get the response text or JSON to provide more info on why the delete failed
      const errorData = await response.text();
      throw new Error(`Failed to delete module: ${errorData}`);
    }

    
    // Close the modal if open
    closeModal();
    onModulesChange();
  } catch (error) {
    console.error("Failed to delete module:", error);
    // You might want to set an error state here to show the error to the user
  }
};
const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false); // Close the modal without deleting
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredModules([]);
  };


  useEffect(() => {
    const matchedModules = searchQuery
      ? modules.filter((module) =>
          module.title.toLowerCase().includes(searchQuery)
        )
      : modules;
    setFilteredModules(matchedModules);
  }, [modules, searchQuery]);


  return (
    <>
      <SearchComponent
        searchText={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onClear={handleClear}
        placeholder="Search modules..."
      />
  
      {filteredModules.map((module) => (
        <h3
          key={module._id}
          className="module-title"
          onClick={() => handleModuleClick(module)}
        >
          {module.title}
        </h3>
      ))}
  
      {modalVisible && selectedModule && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedModule.title}</h2>
              <span
                className="material-symbols-outlined modal-close"
                onClick={closeModal}
              >
                close
              </span>
              <span
                className="material-symbols-outlined modal-download"
                onClick={() =>
                  handleDownload(selectedModule.fileUrl, selectedModule.title)
                }
              >
                file_download
              </span>
              {role === "instructor" && (
                <span
                  className="material-symbols-outlined modal-delete"
                  onClick={() => handleDeleteClick(selectedModule._id)}
                >
                  delete
                </span>
              )}
            </div>
            {selectedModule.fileType.includes("video") ? (
              <video
                controls
                src={selectedModule.fileUrl}
                style={{ width: "100%" }}
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${selectedModule.fileUrl}&embedded=true`}
                width="100%"
                height="400px"
                title="Module Content"
              >
                Your browser does not support iframes, but you can use the
                following link to download the PDF:
                <a href={selectedModule.fileUrl}>Download PDF</a>
              </iframe>
            )}
  
            {isDeleteConfirmationOpen && (
              <ConfirmationModal
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                message={`Are you sure you want to delete ${selectedModule.title}?`}
              />
            )}
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </>
  );
  
};

export default ModuleList;
