import React from 'react';

import ClearIcon from '@mui/icons-material/Clear';

import styles from './DeleteButton.module.css';

const DeleteButton = ({ onClick, ariaLabel, tooltip, disabled = false, className, fontSize = '20px', background = false }) => {
    return (
        <span
            title={tooltip}
            aria-label={ariaLabel}
            role='button'
            style={{
                margin: 0,
                padding: 0,
                lineHeight: 1,
                display: 'inline-block'
            }}
        >
            <ClearIcon
                tabIndex={0}
                className={`${styles['delete-button']} ${disabled && styles.disabled} ${background && styles.background} ${className}`}
                onClick={onClick}
                style={{
                    fontSize
                }}
            />
        </span>
    );
};

export default DeleteButton;