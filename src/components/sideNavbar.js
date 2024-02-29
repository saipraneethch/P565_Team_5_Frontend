import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

//css is from index.css.

const SideNavbar = () => {
  const { user } = useAuthContext();

  return (
    <header>
      <div className="sidenavbarcontainer">
        <nav>
          {user && (
            <div className="sidenavbarlinks">
              <Link to="/admin-dashboard">
                <span className="material-symbols-outlined sidebar">dashboard</span>
                Dashboard
              </Link>
              <Link to="/admin-users">
              <span className="material-symbols-outlined sidebar">group</span>
              Users</Link>
              <Link to="/admin-courses">
              <span className="material-symbols-outlined sidebar">library_books</span>
              Courses</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default SideNavbar;
