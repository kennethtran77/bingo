import React, { useEffect, useLayoutEffect, useState } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Button from './Button';

const Paginate = ({ items, itemsPerPage = 5, setItemsToDisplay, maxPageButtons = 6 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const [mobile, setMobile] = useState(false);

    // trigger mobile pagination on width breakpoint
    useLayoutEffect(() => {
        const query = window.matchMedia("(max-width: 460px");
        setMobile(query.matches);
        query.addEventListener('change', e => setMobile(e.matches));
    }, [])

    useEffect(() => {
        if (items) {
            const newPageCount = Math.ceil(items.length / itemsPerPage);

            setPageCount(newPageCount);
            const pageFirstItemIndex = (currentPage - 1) * itemsPerPage;
            setItemsToDisplay(items.slice(pageFirstItemIndex, pageFirstItemIndex + itemsPerPage));

            // update current page if items size changed
            if (currentPage > newPageCount) {
                setCurrentPage(newPageCount);
            } else if (currentPage <= 0) {
                setCurrentPage(1);
            }
        }
    }, [currentPage, itemsPerPage, items, setItemsToDisplay]);

    const nextPage = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getPageButtons = () => {
        let buttons = [];

        let width = '35px';
        let height = '35px';

        const getButton = (page) => <Button key={page} onClick={() => setCurrentPage(page)} background={currentPage === page} text={page} width={width} height={height} align="center" />;

        if (mobile) {
            return getButton(currentPage);
        }

        if (currentPage <= maxPageButtons) {  // don't render button to 1st page
            for (let i = 1; i <= Math.min(maxPageButtons, pageCount); i++) {
                buttons.push(getButton(i));
            }

            // render last button
            if (maxPageButtons < pageCount) {
                buttons.push(<Button key="..." text="..." disabled width={width} height={height} align='center' />);
                buttons.push(getButton(pageCount));
            }
        } else if (pageCount - currentPage < maxPageButtons) {  // don't render button to last page
            // render first button
            buttons.push(getButton(1));
            buttons.push(<Button key="..." text="..." disabled width={width} height={height} align='center' />);

            for (let i = pageCount - maxPageButtons; i <= pageCount; i++) {
                buttons.push(getButton(i));
            }
        } else {  // render buttons to first and last pages
            // render first button
            buttons.push(getButton(1));
            buttons.push(<Button key="first..." text="..." disabled width={width} height={height} align='center' />);

            for (let i = currentPage - Math.ceil(maxPageButtons / 2); i <= currentPage + Math.floor(maxPageButtons / 2); i++) {
                buttons.push(getButton(i));
            }

            buttons.push(<Button key="second..." text="..." disabled width={width} height={height} align='center'  />);
            buttons.push(getButton(pageCount));
        }

        return buttons;
    };

    return (
        <div className="center-flex gap v-margin">
            <Button
                onClick={prevPage}
                disabled={currentPage <= 1}
                tooltip="Previous Page"
                Icon={<NavigateBeforeIcon />}
            />
            { getPageButtons() }
            <Button
                onClick={nextPage}
                disabled={currentPage >= pageCount}
                tooltip="Next Page"
                Icon={<NavigateNextIcon />}
            />
        </div>
    );
};

export default Paginate;