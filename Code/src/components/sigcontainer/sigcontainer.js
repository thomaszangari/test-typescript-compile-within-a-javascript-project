import React from "react";
import './sigcontainer.css';
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import {UserAction, UserActionCategory} from "../../UserActionCategory";

@inject('playerStore')
@observer
class SigContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    addDefaultSrc(ev) { 
        this.props.playerStore.logAction(UserActionCategory.BUTTON_CLICK, UserAction.VIEW_ESIGNAURE_EXPIRED, 'Claim ID: '+ this.props.playerStore.selectedClaimId, 'Failed to load signature, likely expired');
        ev.target.src = '/images/failed-signature.png';
    }
    
    render() {
        const {eSignatureURL} = this.props.playerStore;
        return (
            <div>
                <img className='sig-img' src={eSignatureURL} onError={this.addDefaultSrc}/>
            </div>
        )
    }
}

export default SigContainer;