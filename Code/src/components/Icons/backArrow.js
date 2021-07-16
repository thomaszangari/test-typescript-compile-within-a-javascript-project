import React from "react";
import './backArrow.css'

const BackArrow = (props) => {
    return <svg width="60px" height="50px" viewBox="0 0 16 16" className="bi bi-arrow-left" fill={props.color || '#000000'}
         xmlns="http://www.w3.org/2000/svg" onClick={props.onClick}>
        <path fill-rule="evenodd"
              d="M5.854 4.646a.5.5 0 0 1 0 .708L3.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
        <path fill-rule="evenodd" d="M2.5 8a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
    </svg>
};

export default BackArrow;
