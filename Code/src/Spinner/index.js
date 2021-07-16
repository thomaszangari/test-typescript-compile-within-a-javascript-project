import React from "react";

import './Spinner.css';

const Spinner = () => {
    return (
        <div className='app-spinner text-secondary'>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;
