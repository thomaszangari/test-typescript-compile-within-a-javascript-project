import React from 'react';
import './toggle.css';

function ToggleOn(props) {
    return (
        <svg class="bi bi-toggle-on toggle-icon"  onClick={props.onToggle}  width={props.size || '16'} height={props.size || '16'} viewBox="0 0 16 16" fill={props.color || 'green'} xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        </svg>
    )
}

export default ToggleOn;