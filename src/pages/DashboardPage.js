import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css'; // Ensure this path is correct

const DashboardPage = () => {
  // Placeholder assignments
  const assignments = [
    { id: 1, title: "Math Homework", dueDate: "2024-02-28" },
    { id: 2, title: "Science Project", dueDate: "2024-03-05" }
  ];

  return (
    <div className="dashboard">
      <nav className="sidebar"> {/* Updated class name */}
        <ul>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>
      </nav>
      <main className="dashboard-content"> {/* Updated class name */}
        <h2>Due Today</h2>
        {/* Logic for displaying dues */}
        <h2>Upcoming Assignments</h2>
        {assignments.length ? (
          assignments.map(a => (
            <div key={a.id}>{a.title} - Due by {a.dueDate}</div>
          ))
        ) : (
          <p>No upcoming assignments</p>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
