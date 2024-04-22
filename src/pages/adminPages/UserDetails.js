// UserDetails.js in pages directory
import React, { useEffect, useState } from "react";
import { useUsersContext } from "../../hooks/useUserContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useNavigate } from "react-router-dom";

import "../../index.css";
import "../../styles/UserDetails.css";

import UserEditModal from "../../components/UserEditModal";
import ConfirmationModal from "../../components/ConfirmationModal";

import defaultAvatar from "../../default_pic.jpg";
import SearchComponent from "../../components/SearchComponent";

// Define the component for individual user details
const UserDetail = ({ userdetail, refreshUsers }) => {
  const { dispatch } = useUsersContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false); // State to control the visibility of the modal

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClick = (userdetail) => {
    // Prevent users from deleting themselves

    if (userdetail.username === user.username) {
      console.log(userdetail._id);
      console.log(user._id);
      alert("You cannot delete your own user.");
      return;
    }
    setUserToDelete(userdetail);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails/${userdetail._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_USER", payload: json });
    }
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false); // Close the modal without deleting
  };

  const handleUpdate = () => {
    // Show the modal by setting isEditing to true
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    // Hide the modal
    setIsEditing(false);
  };

  const handleView = async () => {
    navigate(`/viewuser/${userdetail._id}`);
  };

  return (
    <div>
      <nav></nav>
      <div className="user-details">
        <div className="user-pic">
          <img src={userdetail.avatar || defaultAvatar} alt="Profile" />
        </div>
        <div className="user-info">
          <h3>{userdetail.username}</h3>
          <p>
            <strong>First name: </strong>
            {userdetail.first_name}
          </p>
          <p>
            <strong>Last name: </strong>
            {userdetail.last_name}
          </p>
          <p>
            <strong>Email: </strong>
            {userdetail.email}
          </p>
          <p>
            <strong>Role: </strong>
            {userdetail.role}
          </p>
          <p id="time">
            {formatDistanceToNow(new Date(userdetail.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <span
          className="material-symbols-outlined view-icon"
          onClick={handleView}
        >
          visibility
        </span>
        <span
          className="material-symbols-outlined edit-icon"
          onClick={handleUpdate}
        >
          edit
        </span>
        <span
          className="material-symbols-outlined delete-icon"
          onClick={() => handleDeleteClick(userdetail)}
        >
          delete
        </span>

        {isEditing && (
          <UserEditModal
            selecteduser={userdetail}
            closeModal={handleCloseModal}
            refreshUsers={refreshUsers}
          />
        )}

        {isDeleteConfirmationOpen && (
          <ConfirmationModal
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            message={`Are you sure you want to delete ${userToDelete.username}?`}
          />
        )}
      </div>
    </div>
  );
};

// Define the main component that renders all user details
const UserDetails = () => {
  const { users, dispatch } = useUsersContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/userdetails`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: "SET_USERS", payload: json });
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredUsers([]);
  };

  useEffect(() => {
    const matchedUsers = searchQuery
      ? users.filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery) ||
            user.first_name.toLowerCase().includes(searchQuery) ||
            user.last_name.toLowerCase().includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery)
        )
      : users;
    setFilteredUsers(matchedUsers);
  }, [users, searchQuery]);

  return (
    <div className="ud-home">
      <div >
        {/* <h3 style={{ color: "white" }}>Registered Users</h3> */}
        <SearchComponent
          searchText={searchQuery}
          onSearchSubmit={handleSearchSubmit}
          onSearchChange={handleSearchChange}
          onClear={handleClear}
          placeholder="Search users..."
        />
      </div>
      <div className="users-wrapper">
        <div className="users">
          {users &&
            filteredUsers.map((userdetail) => (
              <UserDetail key={userdetail._id} userdetail={userdetail} refreshUsers={fetchUsers}  />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
