import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import '../styles/App.css';
import React from 'react';
//css is from App.css. no topNavbar.css file 

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <div className="container">
                    <Link to="/">
                        <h2> Wisdom Arena </h2>
                    </Link>
                    <nav>
                        {user && (<div>
                            <span>{user.username}</span>
                            <button id="logout" onClick={handleClick}>
                                Logout
                            </button>
                        </div>
                        )}
                {!user && (
                    <div className='links'>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </nav>
        </div>
        </header >
    )
}

export default Navbar