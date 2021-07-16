import React from "react";
import {Button} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import {UserAction, UserActionCategory} from "../../UserActionCategory";

@inject('playerStore')
@observer
class Details extends React.Component {

    handleCancel = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        const {selectedPlayerDetails} = this.props.playerStore;
        if (selectedPlayerDetails && selectedPlayerDetails.identity) {
            const {identity} = selectedPlayerDetails;
            const {
                firstName, lastName
            } = identity;
            const target = `Player Name: ${firstName} ${lastName}`;
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_DETAILS, target);
        }
    }

    render() {
        const {showBackConfirm} = this.props;
        const {selectedPlayerDetails} = this.props.playerStore;
        if (selectedPlayerDetails && selectedPlayerDetails.identity && selectedPlayerDetails.account) {
            const {identity, account} = selectedPlayerDetails;
            const {
                firstName, lastName, gender, dateOfBirth, ssn, phone, address1, address2, city, state, zip5,
                acceptedEmailCommunication, acceptedSmsCommunication, termsAcceptedDate
            } = identity;
            const {email} = account;
            let {emailVerified} = account;
            emailVerified = emailVerified ? 'Verified' : 'Not Verified'
            return (
                <div className='player-details-container container-fluid '>
                    <div className='player-details-panel'>
                        <div className='player-details-child '>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>First Name</div>
                                    <div className='player-details-value'>{firstName}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Last Name</div>
                                    <div className='player-details-value'>{lastName}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>SSN</div>
                                    <div className='player-details-value'>{ssn}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Date of Birth</div>
                                    <div className='player-details-value'>{dateOfBirth}</div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>Gender</div>
                                    <div className='player-details-value'>{gender}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Mailing Address 1</div>
                                    <div className='player-details-value'>{address1}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Mailing Address 2</div>
                                    <div className='player-details-value'>{address2}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>City</div>
                                    <div className='player-details-value'>{city}</div>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>State</div>
                                    <div className='player-details-value'>{state}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Zipcode</div>
                                    <div className='player-details-value'>{zip5}</div>
                                </div>

                                <div className='col-3'>
                                    <div className='player-details-label'>Email</div>
                                    <div className='player-details-value'>{email}</div>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Phone</div>
                                    <div className='player-details-value'>{phone}</div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>Email Opt-In</div>
                                    <input disabled={true} checked={acceptedEmailCommunication} type="checkbox"
                                    />
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>SMS Opt-In</div>
                                    <input disabled={true} checked={acceptedSmsCommunication} type="checkbox"
                                    />
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>T&C Terms Accept</div>
                                    <input disabled={true} type="checkbox" checked={termsAcceptedDate}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Email Status</div>
                                    <div className='player-details-value'>{emailVerified}</div>
                                </div>
                            </div>
                        </div>
                        <hr className='separator'/>
                        <div className='row player-button-row'>
                            <div className='offset-9 col-3 button-column'>
                                <Button className='player-details-btn ' onClick={() => this.handleCancel()}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className='player-details-container container-fluid'>
            <div className='no-data-message'>Error loading data...go back</div>
        </div>
    }

}

export default Details;
