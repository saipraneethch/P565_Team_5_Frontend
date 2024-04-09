import '../../index.css';
import "../../styles/UserDetails.css";
/**
 * @todo
 * implement backend logic and connectivity for instructor userdetails page. 
 * should probably only include students in the instructors classes
 * 
 */
const UserDetails = () => {
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
        <h1>Welcome to the Instructor User Page</h1>
        {/* Add more content for the home page */}
      </div>
    </div>
  );
}
export default UserDetails;
