import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CourseEditModal from '../src/components/CourseEditModal'; 
import { useAuthContext } from '../src/hooks/useAuthContext'; 


jest.mock('../src/hooks/useAuthContext');


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Success' }),
    ok: true
  })
);

const mockCloseModal = jest.fn();

const selectedCourse = {
    _id: '1',
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'A foundational course in computer science.',
    category: ['Programming'],
    instructor: { _id: '123', name: 'John Doe' },
    bibliography: [{ title: 'Computer Science Illuminated', author: 'Nell Dale' }]
};

beforeEach(() => {
    fetch.mockClear();
    mockCloseModal.mockClear();
    useAuthContext.mockReturnValue({ user: { username: 'admin', token: 'token' } });
});

describe('CourseEditModal', () => {
    test('renders with correct data', () => {
        const { getByLabelText } = render(<CourseEditModal selectedcourse={selectedCourse} closeModal={mockCloseModal} />);

        const courseCodeInput = getByLabelText('Course Code:');
        expect(courseCodeInput.value).toBe(selectedCourse.code);
    });

    test('calls closeModal on cancel', () => {
        const { getByText } = render(<CourseEditModal selectedcourse={selectedCourse} closeModal={mockCloseModal} />);
        fireEvent.click(getByText('Cancel'));
        expect(mockCloseModal).toHaveBeenCalled();
    });
});
