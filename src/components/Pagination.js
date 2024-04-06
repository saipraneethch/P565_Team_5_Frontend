import React, { useState } from 'react';

const Pagination = ({ items, itemsPerPage, render }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {currentItems.map(render)}
      <div>
        {Array.from({ length: maxPage }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;