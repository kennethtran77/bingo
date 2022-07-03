import React, { useEffect, useState } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Button from './Button';

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
        <div className="center-flex gap v-margin">
            <Button
                onClick={prevPage}
                disabled={currentPage <= 0}
                tooltip="Previous Page"
                Icon={<NavigateBeforeIcon />}
            />
            { pageCount > 0 && <Button text={currentPage + 1} /> }
            <Button
                onClick={nextPage}
                disabled={currentPage >= pageCount - 1}
                tooltip="Next Page"
                Icon={<NavigateNextIcon />}
            />
        </div>
    );
};

export default Paginate;