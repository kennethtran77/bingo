import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const style = {
    height: 'calc(100vh - 120px)'
};

const LoadingScreen = () => {
    return (
        <div className="center-flex" style={style}>
            <LoadingSpinner size="big" />
        </div>
    );
};

export default LoadingScreen;