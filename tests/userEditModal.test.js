import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserEditModal from '../src/components/UserEditModal'; 
import { useAuthContext } from '../src/hooks/useAuthContext'; 

jest.mock('../src/hooks/useAuthContext');

describe('UserEditModal', () => {
    beforeAll(() => {
      useAuthContext.mockReturnValue({ user: { username: 'admin', token: 'fake-token' } });
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({ message: 'Success' }),
        ok: true
      }));
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders correctly', () => {
      const closeModal = jest.fn();
      const selecteduser = {
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        role: 'admin'
      };
  
      const { getByText, getByLabelText } = render(
        <UserEditModal selecteduser={selecteduser} closeModal={closeModal} />
      );
  
      expect(getByLabelText('First Name:').value).toBe(selecteduser.first_name);
      expect(getByLabelText('Last Name:').value).toBe(selecteduser.last_name);
      expect(getByLabelText('Username:').value).toBe(selecteduser.username);
      expect(getByText('Save')).toBeInTheDocument();
    });
});
