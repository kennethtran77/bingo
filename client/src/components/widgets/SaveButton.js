import React from 'react';

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import styles from './SaveButton.module.css';

const SaveButton = ({ onClick, ariaLabel, tooltip, className }) => {
    return (
        <span
            title={tooltip}
            role='button'
            aria-label={ariaLabel}
            style={{
                margin: 0,
                padding: 0,
                lineHeight: 1,
                display: 'inline-block'
            }}
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