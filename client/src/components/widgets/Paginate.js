import React, { useEffect, useState } from 'react';

import './Paginate.css';

const Paginate = ({ items, itemsPerPage, setItemsToDisplay }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        if (items) {
            const newPageCount = Math.ceil(items.length / itemsPerPage);

            setPageCount(newPageCount);
            const pagesVisited = currentPage * itemsPerPage;
            setItemsToDisplay(items.slice(pagesVisited, pagesVisited + itemsPerPage));

            // update current page if items size changed
            if (currentPage > 0 && currentPage > newPageCount - 1) {
                setCurrentPage(newPageCount - 1);
            }
        }
    }, [currentPage, itemsPerPage, items, setItemsToDisplay]);

    const nextPage = () => {
        if (currentPage < pageCount - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="pagination-buttons v-margin">
            <button className="pagination-button" onClick={prevPage} disabled={currentPage <= 0}>{"<"}</button>
            { pageCount > 0 && <button className="pagination-button">{currentPage + 1}</button> }
            <button className="pagination-button" onClick={nextPage} disabled={currentPage >= pageCount - 1}>{">"}</button>
        </div>
    );
};

export default Paginate;