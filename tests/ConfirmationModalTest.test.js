import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../src/components/ConfirmationModal.js'; 

describe('ConfirmationModal', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    const message = "Are you sure?";

    beforeEach(() => {
        render(<ConfirmationModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} message={message} />);
    });

    it('should render the confirmation message', () => {
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should call onConfirm when Yes button is clicked', () => {
        fireEvent.click(screen.getByText('Yes'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when No button is clicked', () => {
        fireEvent.click(screen.getByText('No'));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
