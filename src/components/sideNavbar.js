import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'


//css is from index.css. 

const Navbar = () => {
    
    const {user}=useAuthContext()

    

    return (
        <header>
            <div className="container">
                <nav>
                    
                    {user && (
                    <div className='links'>
                        <Link to="/admin-dashboard">Dashboard</Link>
                        <Link to="/admin-users">Users</Link>
                        <Link to="/admin-courses">Courses</Link>
                    </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar