import React from "react";
import './Dashboard.css';

class CustomCard extends React.Component {
    render() {
        const {title, iconPath, handleCallback} = this.props;

        return (
            <div className='dashboard-card' onClick={handleCallback}>
               {iconPath &&  <div className='dashboard-card-icon'> <img src={iconPath} /></div>}
                <div className='dashboard-card-label'>{title}</div>
            </div>
        )
    }
}

export default CustomCard;
