import '../../index.css';
import '../../styles/App.css';
import '../../styles/ViewCourses.css';

const Courses = () => {
    return (
        <div>
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
            <div className='add-buffer'>
                <div className="course-container">
                    <div className="course-details">
                        <h3>Introduction to Programming</h3>
                        <p><strong>Course Code: </strong>CSCI 101</p>
                        <p><strong>Instructor: </strong>John Smith</p>
                    </div>
                    <div className="course-details">
                        <h3>Data Structures</h3>
                        <p><strong>Course Code: </strong>CSCI343</p>
                        <p><strong>Instructor: </strong>Amr Sabry</p>
                    </div>
                    <div className="course-details">
                        <h3>Web Development</h3>
                        <p><strong>Course Code: </strong>INFO365</p>
                        <p><strong>Instructor: </strong>Erika Lee</p>
                    </div>
                    <div className="course-details">
                        <h3>Algorithms</h3>
                        <p><strong>Course Code: </strong>CSCI405</p>
                        <p><strong>Instructor: </strong>Prof. Wilson</p>
                    </div>
                    {/* Add more course details as needed */}
                </div>
                <div className="course-container">
                    <div className="course-details">
                        <h3>Introduction to Programming</h3>
                        <p><strong>Course Code: </strong>CSCI 101</p>
                        <p><strong>Instructor: </strong>John Smith</p>
                    </div>
                    <div className="course-details">
                        <h3>Data Structures</h3>
                        <p><strong>Course Code: </strong>CSCI343</p>
                        <p><strong>Instructor: </strong>Amr Sabry</p>
                    </div>
                    <div className="course-details">
                        <h3>Web Development</h3>
                        <p><strong>Course Code: </strong>INFO365</p>
                        <p><strong>Instructor: </strong>Erika Lee</p>
                    </div>
                    <div className="course-details">
                        <h3>Algorithms</h3>
                        <p><strong>Course Code: </strong>CSCI405</p>
                        <p><strong>Instructor: </strong>Prof. Wilson</p>
                    </div>
                    {/* Add more course details as needed */}
                </div>
            </div>
        </div>
    );
};

export default Courses;