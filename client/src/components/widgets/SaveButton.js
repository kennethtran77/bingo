import React from 'react';

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import styles from './SaveButton.module.css';

const SaveButton = ({ onClick, ariaLabel, tooltip, className }) => {
    return (
        <span
            title={tooltip}
            role='button'
            aria-label={ariaLabel}
        >
            <SaveAltIcon
                tabIndex={0}
                className={`${styles['save-button']} ${className}`}
                onClick={onClick}
                style={{
                    fontSize: '20px'
                }}
            />
        </span>
    );
};

export default SaveButton;