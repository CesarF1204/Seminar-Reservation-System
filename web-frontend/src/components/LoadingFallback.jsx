import React from 'react';
import '../styles/LoadingFallback.css';

const LoadingFallback = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
        </div>
    )
}

export default LoadingFallback;
