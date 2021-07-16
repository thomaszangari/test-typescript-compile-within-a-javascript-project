import React from "react";
import './tile.css';

class Tile extends React.Component {
    render() {
        const {title, value, iconPath, handleCallback} = this.props;

        return (
            <div className='tile-card' onClick={handleCallback}>
                <div className='tile-card-label'>{title}</div>      
            </div>
        )
    }
}

export default Tile;