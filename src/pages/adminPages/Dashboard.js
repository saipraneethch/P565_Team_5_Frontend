import React from "react";
import "../../styles/HomePage.css"; // Import CSS for styling
import { useAuthContext } from "../../hooks/useAuthContext";

import '../../index.css';
import '../../styles/App.css';

const AdminDashboard = () => {
  const { user } = useAuthContext();

  console.log("in admin dashboard:");

  // Conditional console log to avoid undefined errors
  if (user) {
    console.log(user.username); // Assuming the username is directly on the user object
  } else {
    console.log("User is not defined.");
  }

  return (
    <div className="homepage">
       <nav>
        <div className="nav-wrapper">
          <form>
            <div className="input-field">
              <input id="search" type="search" required />
              <button id="search">SEARCH</button>{/* add an onclick to run the search call */}
            </div>
          </form>
        </div>
      </nav>
      <div className="home-container">
        <h1>Welcome to the Admin Dashboard, {user ? user.username : "Guest"}</h1>
        {/* Add more content for the home page */}
      </div>
    </div>
  );
};


export default AdminDashboard;