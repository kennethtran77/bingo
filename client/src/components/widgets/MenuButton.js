import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';

import styles from './MenuButton.module.css';

const MenuButton = ({ onClick, ariaLabel, tooltip, disabled = false, className, id, fontSize = '20px'}) => {
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
            <MenuIcon
                tabIndex={0}
                id={id}
                className={`${styles['menu-button']} ${disabled ? styles.disabled : null} ${className}`}
                onClick={onClick}
                style={{
                    fontSize
                }}
            />
        </span>
    );
};

export default MenuButton;