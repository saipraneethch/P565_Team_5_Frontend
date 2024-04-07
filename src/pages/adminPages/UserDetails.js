// UserDetails.js in pages directory
import React, { useEffect, useState } from "react";
import { useUsersContext } from "../../hooks/useUserContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useNavigate } from 'react-router-dom';

import '../../index.css';
import "../../styles/UserDetails.css";

import UserEditModal from '../../components/UserEditModal';
import ConfirmationModal from '../../components/ConfirmationModal';

import defaultAvatar from '../../default_pic.jpg';


// Define the component for individual user details
const UserDetail = ({ userdetail }) => {
  const { dispatch } = useUsersContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false); // State to control the visibility of the modal

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();


  const handleDeleteClick = (userdetail) => {
    // Prevent users from deleting themselves

    if (userdetail.username === user.username) {
      console.log(userdetail._id)
      console.log(user._id)
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
    const response = await fetch(`/api/v1/userdetails/${userdetail._id}`, {
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
      <nav>
        <div className="nav-wrapper">
          <form>
            {/* <div className="input-field">
              <input id="search" type="search" required />
              <button id="search">SEARCH</button>
            </div> */}
          </form>
        </div>
      </nav>
      <div className="user-details">
        <div className="user-pic">
          <img src={userdetail.avatar || defaultAvatar} alt="Profile" />
        </div>
        <div className="user-info">
          <h3>{userdetail.username}</h3>
          <p><strong>First name: </strong>{userdetail.first_name}</p>
          <p><strong>Last name: </strong>{userdetail.last_name}</p>
          <p><strong>Email: </strong>{userdetail.email}</p>
          <p><strong>Role: </strong>{userdetail.role}</p>
          <p id="time">{formatDistanceToNow(new Date(userdetail.createdAt), { addSuffix: true })}</p>
        </div>

        <span className="material-symbols-outlined view-icon" onClick={handleView}>visibility</span>
        <span className="material-symbols-outlined edit-icon" onClick={handleUpdate}>edit</span>
        <span className="material-symbols-outlined delete-icon" onClick={() => handleDeleteClick(userdetail)}>delete</span>

        {isEditing && <UserEditModal selecteduser={userdetail} closeModal={handleCloseModal} />}

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

  console.log(users)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/userdetails", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        console.log(json)

        if (response.ok) {
          dispatch({ type: "SET_USERS", payload: json });
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [dispatch, user]);


  //variables for pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;//for each page


  const usersToDisplay = users.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(users.length / usersPerPage);
  const numbers = [...Array(nPages + 1).keys()].slice(1);//number of all the pages 1 to n

  function nextPage() {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  return (
    <div>
      <div className="home">
        <div className="users-wrapper">
          <h1 className="users-header">Users</h1>
          <div className="users">

            {users &&
              usersToDisplay.map((userdetail) => (
                <UserDetail key={userdetail._id} userdetail={userdetail} />
              ))}
          </div>
          {/* For debugging: */}
          {/* <pre>{JSON.stringify(users, null, 2)}</pre> This will print the updated `userdetails` */}
        </div>


      </div>
      <nav>
        {/* prev */}
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link" onClick={prevPage}>Prev</button>
          </li>

          {/* numbers */}
          {
            numbers.map((n) => (
              <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
                <button className="page-link" onClick={() => changeCPage(n)} >{n}</button>
              </li>
            ))
          }

          {/* next */}
          <li className="page-item">
            <button className="page-link" onClick={nextPage}>Next</button>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default UserDetails;
