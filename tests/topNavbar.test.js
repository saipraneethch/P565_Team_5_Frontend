import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
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

        render(<Router><Navbar /></Router>);
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByText(/register/i)).toBeInTheDocument();
    });

    test('renders user info and logout button when user is logged in', () => {
        useAuthContext.mockReturnValue({ user: { username: 'testuser' } });

        render(<Router><Navbar /></Router>);
        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    test('calls logout function when logout button is clicked', () => {
        useAuthContext.mockReturnValue({ user: { username: 'testuser' } });

        render(<Router><Navbar /></Router>);
        const logoutButton = screen.getByText(/logout/i);
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
    });
});
