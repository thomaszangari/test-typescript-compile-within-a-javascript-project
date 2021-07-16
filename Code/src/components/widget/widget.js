import React from "react";
import './widget.css';

class Widget extends React.Component {
    render() {
        const {title, value, iconPath, handleCallback} = this.props;

        return (
            <div className='widget-card' onClick={handleCallback}>
                <div className='widget-card-data'>{value}</div>
                <div className='widget-card-label'>{title}</div>
               {iconPath &&  <div className='widget-card-icon'> <img src={iconPath} /></div>}
            </div>
        )
    }
}

export default Widget;