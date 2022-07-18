import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const style = {
    height: '100vh',
    width: '100vw',
    transform: 'scale(2.0)'
};

const LoadingScreen = () => {
    return (
        <div className="center-flex" style={style}>
            <LoadingSpinner/>
        </div>
    );
};

export default LoadingScreen;