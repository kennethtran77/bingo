import React from 'react';

import AddIcon from '@mui/icons-material/Add';

import styles from './NewButton.module.css';

const NewButton = ({ onClick, ariaLabel, tooltip, className }) => {
    return (
        <span
            title={tooltip}
            role='button'
            aria-label={ariaLabel}
        >
            <AddIcon
                tabIndex={0}
                className={`${styles['new-button']} ${className}`}
                onClick={onClick}
                style={{
                    fontSize: '20px'
                }}
            />
        </span>
    );
};

export default NewButton;