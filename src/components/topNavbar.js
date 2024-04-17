import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import '../styles/App.css';
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
                        <h1> Wisdom Arena </h1>
                    </Link>
                    <nav>
                        {user && (<div>
                            
                            <span style={{ fontStyle: 'italic' }}><Link to="/edituser">{user.username}</Link></span>
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