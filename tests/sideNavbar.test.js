import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import SideNavbar from '../src/components/sideNavbar'; 
import { useAuthContext } from '../src/hooks/useAuthContext'; 

jest.mock('../src/hooks/useAuthContext'); 

describe('SideNavbar', () => {
  const setup = (role) => {
    useAuthContext.mockReturnValue({ user: { role: role } });
    return render(<Router><SideNavbar /></Router>);
  };

  test('renders admin links for admin user', () => {
    const { getByText } = setup('admin');
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Courses')).toBeInTheDocument();
  });

  test('renders instructor links for instructor user', () => {
    const { getByText } = setup('instructor');
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Courses')).toBeInTheDocument();
  });

  test('renders student links and handles course dropdown for student user', () => {
    const { getByText, queryByText } = setup('student');

    const coursesDropdown = getByText('Courses');
    fireEvent.click(coursesDropdown);

    expect(getByText('Enrolled Courses')).toBeInTheDocument();
    expect(getByText('Enroll in a New Course')).toBeInTheDocument();
    expect(getByText('Drop a Course')).toBeInTheDocument();

    fireEvent.click(coursesDropdown); 
    expect(queryByText('Enroll in a New Course')).not.toBeInTheDocument(); 
  });

  
});
