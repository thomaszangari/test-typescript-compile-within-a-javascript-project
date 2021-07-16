import React from "react";
import {Button, Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import './Tabs.css';

@inject('playerStore')
@observer
class ConfirmEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showCancelPopup: false,
            onYesClicked: false
        }
    }

    handleSubmit = () => {
        this.props.playerStore.setShowConfirmEmailModal(true);
    }

    onSubmitCancel = () => {
        this.props.playerStore.setShowConfirmEmailModal(false);
    }

    onRejectCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(false));
    }

    onCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(true));
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    handleToastClose = () => {
        const navigateToFirstTab = this.props.playerStore.successMessage;
        this.props.playerStore.setToast(false);
        if (navigateToFirstTab)
            this.props.navigateToFirstTab();
    }

    APICallback = () => {
        this.props.playerStore.confirmPlayerEmail();
    }

    onYes = () => {
        this.setState({onYesClicked: true}, () => this.APICallback());
    }

    render() {

        const {showCancelPopup} = this.state;
        const {showBackConfirm} = this.props;
        const {selectedPlayerDetails, showConfirmEmailModal, showToast, successMessage, errorMessage} = this.props.playerStore;

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
                    {/*{showToast
                        ?
                        <AppToast showToast={showToast}
                                  message={successMessage ? successMessage : errorMessage}
                                  isSuccessMessage={successMessage !== null}
                                  handleClose={() => this.handleToastClose()}/>
                        : null
                    }*/}
                    <Modal show={showCancelPopup || showBackConfirm} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you would like to cancel? All unsaved changes will be lost.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onRejectCancel(e)}>No</Button>
                            <Button variant='primary' onClick={(e) => this.onCancel(e)}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showConfirmEmailModal} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you would like to confirm the Email address?
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onSubmitCancel(e)}>No</Button>
                            <Button variant='primary' onClick={() => this.onYes()}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
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
                            <div className='offset-6 col-3 button-column'>
                                <Button className='player-details-btn'
                                        onClick={() => this.handleSubmit()}>
                                    Confirm Email
                                </Button>
                            </div>
                            <div className='col-3 button-column'>
                                <Button className='player-details-btn ' onClick={() => this.handleCancel()}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className='player-details-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>
        }

    }

}

export default ConfirmEmail;
