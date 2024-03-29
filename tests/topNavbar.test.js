import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../src/components/topNavbar'; 
import { useAuthContext } from '../src/hooks/useAuthContext'; 
import { useLogout } from '../src/hooks/useLogout'; 


jest.mock('../src/hooks/useAuthContext');
jest.mock('../src/hooks/useLogout');

describe('Navbar', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        
        mockLogout.mockClear();
        useLogout.mockReturnValue({ logout: mockLogout });
    });

    test('renders login and register links when no user is logged in', () => {
        useAuthContext.mockReturnValue({ user: null });

        const { getByText } = render(<Router><Navbar /></Router>);
        expect(getByText('Login')).toBeInTheDocument();
        expect(getByText('Register')).toBeInTheDocument();
    });

    test('renders user info and logout button when user is logged in', () => {
        useAuthContext.mockReturnValue({ user: { username: 'testuser' } });

        const { getByText } = render(<Router><Navbar /></Router>);
        expect(getByText('testuser')).toBeInTheDocument();
        expect(getByText('Logout')).toBeInTheDocument();
    });

    test('calls logout function when logout button is clicked', () => {
        useAuthContext.mockReturnValue({ user: { username: 'testuser' } });

        const { getByText } = render(<Router><Navbar /></Router>);
        const logoutButton = getByText('Logout');
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
    });
});
