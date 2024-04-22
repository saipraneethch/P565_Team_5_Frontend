import { Link } from "react-router-dom";
import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
//css is from index.css by default

const SideNavbar = () => {
  const { user } = useAuthContext();
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  if (user?.role === 'admin') {
    return (
      <header>
        <div className="sidenavbarcontainer">
          <nav>
            {user && (
              <div className="sidenavbarlinks">
                <Link to="/">
                  <span className="material-symbols-outlined sidebar">home</span>
                  Home
                </Link>
                <Link to="/dashboard">
                  <span className="material-symbols-outlined sidebar">dashboard</span>
                  Dashboard
                </Link>
                <Link to="/users">
                  <span className="material-symbols-outlined sidebar">group</span>
                  Users</Link>


                <Link to="/courses">
                  <span className="material-symbols-outlined sidebar">library_books</span>
                  Courses
                </Link>

                {/* inavtive links for placeholders for now, add routes when pages exist... 
                <Link to="/grades">
                  <span className="material-symbols-outlined sidebar">grade</span>
                  Grades
                </Link> */}
                <Link to="/chat">
                  <span className="material-symbols-outlined sidebar">mode_comment</span>
                  Chat
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }//close admin if

  if (user.role === 'instructor') {
    return (
      <header>
        <div className="sidenavbarcontainer">
          <nav>
            {user && (
              <div className="sidenavbarlinks">
                <Link to="/">
                  <span className="material-symbols-outlined sidebar">home</span>
                  Home
                </Link>
                {/* <Link to="/dashboard">
                  <span className="material-symbols-outlined sidebar">dashboard</span>
                  Dashboard
                </Link> */}
                <Link to="/users">
                  <span className="material-symbols-outlined sidebar">group</span>
                  Users</Link>
                <Link to="/courses">
                  <span className="material-symbols-outlined sidebar">library_books</span>
                  Courses
                </Link>
                {/* inavtive links for placeholders for now, add routes when pages exist...  */}
                {/* <Link to="/grades">
                  <span className="material-symbols-outlined sidebar">grade</span>
                  Grades
                </Link> */}
                <Link to="/chat">
                  <span className="material-symbols-outlined sidebar">mode_comment</span>
                  Chat
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }//close instructor if

  if (user?.role === 'student') {
    return (
      <header>
        <div className="sidenavbarcontainer">
          <nav>
            {user && (
              <div className="sidenavbarlinks">
                <Link to="/">
                  <span className="material-symbols-outlined sidebar">home</span>
                  Home
                </Link>
                <Link to="/dashboard">
                  <span className="material-symbols-outlined sidebar">dashboard</span>
                  Dashboard
                </Link>
                <div onClick={() => setCoursesExpanded(!coursesExpanded)} className="course-dropdown">
                  <span className="material-symbols-outlined sidebar">library_books</span>
                  Courses

                </div>
                {coursesExpanded && (
                  <div className="course-submenu">
                    <Link to="/enrolled-courses">Enrolled Courses</Link>
                    <Link to="/enroll-new-course">Enroll in a New Course</Link>
                    <Link to="/drop-course">Drop a Course</Link>
                  </div>
                )}

                {/* inavtive links for placeholders for now, add routes when pages exist...  */}
                <Link to="/grades">
                  <span className="material-symbols-outlined sidebar">grade</span>
                  Grades
                </Link>
                <Link to="/chat">
                  <span className="material-symbols-outlined sidebar">mode_comment</span>
                  Chat
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }//close student if

};

export default SideNavbar;
