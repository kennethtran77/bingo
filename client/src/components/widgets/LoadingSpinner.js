import React from 'react';

import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'small' }) => {
    return (
        <div className={`${styles["loading-spinner"]} ${styles[size]}`} aria-label="Loading" title="Loading" />
    );
};

export default LoadingSpinner;