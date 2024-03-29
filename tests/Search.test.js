import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchComponent from '../src/components/SearchComponent'; 

describe('SearchComponent', () => {
    const placeholderText = 'Search...';
    let searchText = 'initial value';
    const onSearchChange = jest.fn(event => {
        searchText = event.target.value;
    });
    const onSearchSubmit = jest.fn();
    const onClear = jest.fn();

    beforeEach(() => {
        onSearchChange.mockClear();
        onSearchSubmit.mockClear();
        onClear.mockClear();
    });

    test('renders with placeholder text and initial value', () => {
        const { getByPlaceholderText, getByDisplayValue } = render(
            <SearchComponent
                searchText={searchText}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onClear={onClear}
                placeholder={placeholderText}
            />
        );

        expect(getByPlaceholderText(placeholderText)).toBeInTheDocument();
        expect(getByDisplayValue(searchText)).toBeInTheDocument();
    });

    test('calls onSearchChange when input is changed', () => {
        const { getByDisplayValue } = render(
            <SearchComponent
                searchText={searchText}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onClear={onClear}
                placeholder={placeholderText}
            />
        );

        const inputElement = getByDisplayValue(searchText);
        fireEvent.change(inputElement, { target: { value: 'new search' } });
        expect(onSearchChange).toHaveBeenCalled();
    });

    test('calls onSearchSubmit when form is submitted', () => {
        const { getByText } = render(
            <SearchComponent
                searchText={searchText}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onClear={onClear}
                placeholder={placeholderText}
            />
        );

        fireEvent.click(getByText('Search'));
        expect(onSearchSubmit).toHaveBeenCalled();
    });

    test('calls onClear when clear button is clicked', () => {
        const { getByText } = render(
            <SearchComponent
                searchText={searchText}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onClear={onClear}
                placeholder={placeholderText}
            />
        );

        fireEvent.click(getByText('Clear'));
        expect(onClear).toHaveBeenCalled();
    });
});
