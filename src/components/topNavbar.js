import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

import '../styles/App.css';

import React from 'react';
import logo from '../logo.png';
const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const handleClick = () => {
        logout();
    };
    return (
        <header className="navbar-header"> {/* Class for navbar header */}
            <div className="navbar-container"> {/* Ensures horizontal layout */}
                <div className="navbar-logo"> {/* Align logo and text */}
                    <img src={logo} alt="Logo" className="logo-image" />
                    <h2>Wisdom Arena</h2>
                </div>
                <nav className="navbar-nav"> {/* Navigation section */}
                    {user ? (
                        <div className="user-info">
                            <span style={{ fontStyle: 'italic' }}><Link to="/edituser">{user.username}</Link></span>
                            <button id="logout" onClick={handleClick}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <nav className="links-nav">
                            <span>
                                <Link to="/homepage">HOME</Link> {/* Link to home */}
                            </span>
                            <span>
                                <Link to="/login">LOGIN</Link> {/* Link to login */}
                            </span>
                            <span>
                                <Link to="/register">REGISTER</Link> {/* Link to register */}
                            </span>
                        </nav>
                    )}
                </nav>
            </div>
        </header>
    );
};
export default Navbar;






