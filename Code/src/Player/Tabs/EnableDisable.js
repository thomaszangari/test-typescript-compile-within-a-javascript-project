import React from "react";
import {Button, Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import {UnlockPlayerReasonCodes} from "../../Constants/UnlockPlayerReasonCodes";
import {LockPlayerReasonCodes} from "../../Constants/LockPlayerReasonCodes";

@inject('playerStore')
@observer
class EnableDisable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFieldsEdited: false,
            locked: true,
            isUpdate: false,
            showSuccess: false,
            successMessage: '',
            showToast: false,
            showCancelPopup: false,
            onYesClicked: false,
            reason: '',
            comment: ''
        }
    }

    handleSubmit = () => {
        this.props.playerStore.setShowPlayerEnableDisableModal(true);
    }

    onSubmitCancel = () => {
        this.props.playerStore.setShowPlayerEnableDisableModal(false)
    }

    onRejectCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(false));
    }

    onCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(true));
    }

    handleToastClose = () => {
        const navigateToFirstTab = this.props.playerStore.successMessage;
        this.props.playerStore.setToast(false);
        if (navigateToFirstTab)
            this.props.navigateToFirstTab();
    }

    APICallback = () => {

        let enabled;
        const {selectedPlayerDetails} = this.props.playerStore;
        if (selectedPlayerDetails && selectedPlayerDetails.identity && selectedPlayerDetails.account) {
            const {identity} = selectedPlayerDetails;
            enabled = identity.scanStatus == 'ENABLED';
        }

        console.log(enabled);
        const {reason, comment} = this.state;

        if (enabled) {
            this.props.playerStore.disablePlayerScan(reason, comment);
        } else {
            this.props.playerStore.enablePlayerScan(reason, comment);
        }
    }

    onYes = () => {
        this.setState({onYesClicked: true}, () => this.APICallback());
    }

    handleCancel = () => {
        if (this.state.isFieldsEdited)
            this.setState({showCancelPopup: true});
        else
            this.props.history.goBack();
    }

    isEmailValid = (email) => {
        return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    }

    callbackToParent = () => {
        const {isFieldsEdited} = this.state;
        const flag = isFieldsEdited;
        this.props.onUpdate(flag);
    }

    handleInputChange = (e, stateName) => {
        this.setState({[stateName]: e.target.value, isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleSelectChange = (e, stateName) => {
        const val = e.target.value;
        this.setState({[stateName]: val, isFieldsEdited: true}, () => this.callbackToParent());
    }

    render() {

        const {showCancelPopup, reason, comment} = this.state;
        const {showBackConfirm} = this.props;
        const {selectedPlayerDetails, showPlayerLockUnlockModal, showPlayerEnableDisableModal, showToast, successMessage, errorMessage} = this.props.playerStore;

        let isDisabled = false;

        if (selectedPlayerDetails && selectedPlayerDetails.identity && selectedPlayerDetails.account) {
            const {identity, account} = selectedPlayerDetails;
            const {
                firstName, lastName, gender, dateOfBirth, ssn, phone, address1, address2, city, state, zip5,
                acceptedEmailCommunication, acceptedSmsCommunication, termsAcceptedDate, identityCheckResult, scanStatus 
            } = identity;
            const {email, enabled} = account;

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
                    <Modal show={showPlayerEnableDisableModal} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you would like to Enable/Disable Scans?
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onSubmitCancel(e)}>No</Button>
                            <Button variant='primary' onClick={(e) => this.onYes(e)}>Yes</Button>
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
                                    <input disabled={true} type="checkbox" id="exampleCheck1"
                                           checked={acceptedEmailCommunication}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>SMS Opt-In</div>
                                    <input disabled={true} type="checkbox" id="exampleCheck1"
                                           checked={acceptedSmsCommunication}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>T&C Terms Accept</div>
                                    <input disabled={true} type="checkbox" id="exampleCheck1"
                                           checked={termsAcceptedDate}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Ticket Scanner Status</div>
                                    <div className='player-details-value'>{scanStatus == 'ENABLED'  ? 'Enabled' : 'Disabled'}</div>
                                </div>
                            </div>
                            <div className='row'>
                            <div className='col-3'/>
                            <div className='col-3'/>
                                <div className='col-3'>
                                    <div className='player-details-label'>Comments</div>
                                    <textarea type="textarea" id="comment"
                                              onChange={(e) => this.handleInputChange(e, 'comment')}>{comment}</textarea>
                                </div>
                            </div>
                        </div>

                        <hr className='separator'/>
                        <div className='row player-button-row'>
                            <div className='offset-6 col-3 button-column'>
                                {
                                    (scanStatus == 'ENABLED') ?
                                        <Button className='player-details-btn' disabled={isDisabled}
                                                onClick={() => this.handleSubmit()}>
                                            Disable
                                        </Button> :
                                        <Button className='player-details-btn' disabled={isDisabled}
                                                onClick={() => this.handleSubmit()}>
                                            Enable
                                        </Button>
                                }
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

export default EnableDisable;
