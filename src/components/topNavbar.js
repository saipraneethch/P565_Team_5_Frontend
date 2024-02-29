import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
// import '../styles/topNavbar.css';

//css is from index.css. dont use topNavbar.css

const Navbar = () => {
    const {logout}=useLogout()
    const {user}=useAuthContext()

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
                        <span>{user.username}</span>
                        <button onClick={handleClick}>
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
        </header>
    )
}

export default Navbar