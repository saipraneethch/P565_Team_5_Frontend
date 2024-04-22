import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import '../../styles/HomePage.css';

import { useAuthContext } from '../../hooks/useAuthContext';

const InstructorHomePage = () => {
    const { user } = useAuthContext();
    const [courseData, setCourseData] = useState({
        labels: [],
        enrollment: [],
        averageGrade: [],
    });

    const [selectedCourse, setSelectedCourse] = useState(null);

    const instructor_id = user._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/v1/coursedetails/get-instructor-courses-for-charts/${instructor_id}`, {
                    method: 'GET',
                });
                const data = await response.json();

                const labels = Object.keys(data).map(
                    (courseId) => `${data[courseId].courseCode}: ${data[courseId].courseTitle}`
                );

                const enrollment = labels.map(
                    (label) => data[Object.keys(data).find((id) => `${data[id].courseCode}: ${data[id].courseTitle}` === label)].numberOfUsersEnrolled
                );

                const averageGrade = labels.map(
                    (label) => data[Object.keys(data).find((id) => `${data[id].courseCode}: ${data[id].courseTitle}` === label)].averageGrade
                );

                setCourseData({
                    labels,
                    enrollment,
                    averageGrade,
                });

                setSelectedCourse(labels[0]); // Default to the first course for initial gauge chart
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const selectedAverageGrade = courseData.averageGrade[
        courseData.labels.indexOf(selectedCourse)
    ];

    const gaugeValue = selectedAverageGrade !== null ? selectedAverageGrade * 0.01 : 0;

    return (
        <div className="dashboard-container">
            <h1>Instructor Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft:'150px', padding:"20px" }}>
                <div className="chart-container">
                    <Bar
                        data={{
                            labels: courseData.labels,
                            datasets: [
                                {
                                    label: 'Students Enrolled',
                                    data: courseData.enrollment,
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
                <div className="chart-container">
                    <label htmlFor="course-select">Select a Course:</label>
                    <select
                        id="course-select"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        {courseData.labels.map((label, index) => (
                            <option key={index} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <div style={{ fontSize: '12px', color: 'black' }}>
                        <GaugeChart
                            id="gauge-chart3"
                            nrOfLevels={30}
                            colors={["#FF5F6D", "#FFC371", "#00E396"]}
                            percent={gaugeValue}
                            formatTextValue={() => `${(selectedAverageGrade ?? 0).toFixed(2)}%`} // Convert to two decimal places
                            textColor="rgb(14, 39, 81)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorHomePage;
