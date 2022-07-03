import React from 'react';

import DeleteButton from './DeleteButton';
import NewButton from './NewButton';

import styles from './OrderingSelector.module.css';

const OrderingSelector = ({ currOrdering, selectOrdering, orderings, addOrdering, deleteOrdering }) => {
    return (
        <ul className={`container secondary no-margin ${styles.tabs}`}>
            <li key="new">
                <NewButton
                    aria-label="New Ordering"
                    tooltip="New Ordering"
                    onClick={() => addOrdering()}
                />
            </li>
            <li key="delete">
                <DeleteButton
                    aria-label="Delete Current Ordering"
                    tooltip="Delete Current Ordering"
                    disabled={orderings.length <= 1}
                    background
                    onClick={() => {
                        if (orderings.length > 1) {
                            // Decrement currOrdering
                            if (currOrdering === orderings.length - 1) {
                                selectOrdering(currOrdering - 1);
                            }

                            deleteOrdering(currOrdering);
                        }
                    }}
                />
            </li>
            { orderings.map((_, index) => (
                <li
                    key={`ordering-tab-${index}`}
                    className={`${styles.tab} ${currOrdering === index ? styles.active : null}`}
                    title={`Ordering ${index + 1}`}
                    aria-label={`Ordering ${index + 1}`}
                    onClick={e => {
                        e.preventDefault();
                        selectOrdering(index);
                    }}
                >
                    {index + 1}
                </li>
            )) }
        </ul>
    );
};

export default OrderingSelector;