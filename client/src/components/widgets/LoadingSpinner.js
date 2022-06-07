import React from 'react';

import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className={styles["loading-spinner"]} aria-label="Loading" title="Loading" />
    );
};

export default LoadingSpinner;