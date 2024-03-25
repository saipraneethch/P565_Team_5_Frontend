// SearchComponent.js
import React from 'react';

const SearchComponent = ({ searchText, onSearchChange, onSearchSubmit, onClear, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={searchText}
        onChange={onSearchChange}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
      <button type="button" onClick={onClear} className="clear-button">Clear</button>
    </form>
  );
};

export default SearchComponent;
