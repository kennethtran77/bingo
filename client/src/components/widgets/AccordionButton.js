import React from 'react';

import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import styles from './AccordionButton.module.css';

const AccordionButton = ({ open, onClick, ariaLabel, tooltip, className, fontSize = '20px' }) => {
    const Icon = open ? KeyboardDoubleArrowUpIcon : KeyboardDoubleArrowDownIcon;
    
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
            <Icon
                tabIndex={0}
                className={`${styles['accordion-button']} ${className}`}
                onClick={onClick}
                style={{
                    fontSize
                }}
            />
        </span>
    );
};

export default AccordionButton;