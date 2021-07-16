import React from "react";
import { Button, Modal } from "react-bootstrap";
import { inject, observer } from "mobx-react";
import './Tabs.css';
import { KYCIdentificationOne } from "../../Constants/KYCIdentificationOne";
import { KYCIdentificationTwo } from "../../Constants/KYCIdentificationTwo";
import { checkRenderPermissions } from "../../helpers";
import { permissions } from "../../constants";
import AppTextbox from "../../AppTextbox";
import { DisplayDocument } from './../../components/DisplayDocument';

const IdentityCheckResult = {
    PASS: "PASS",
    FAIL: "FAIL",
}

@inject('playerStore')
@observer
class KYCVerification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFieldsEdited: false,
            showSuccess: false,
            successMessage: '',
            showToast: false,
            showCancelPopup: false,
            onYesClicked: false,
            identification1: '',
            identification2: '',
            comment1: '',
            comment2: ''
        }
    }

    handleSubmit = () => {
        this.props.playerStore.setShowPlayerVerifyModal(true);
    }

    onSubmitCancel = () => {
        this.props.playerStore.setShowPlayerVerifyModal(false)
    }

    onRejectCancel = () => {
        this.setState({ showCancelPopup: false }, () => this.props.handlePopup(false));
    }

    onCancel = () => {
        this.setState({ showCancelPopup: false }, () => this.props.handlePopup(true));
    }

    handleCancel = () => {
        if (this.state.isFieldsEdited)
            this.setState({ showCancelPopup: true });
        else
            this.props.history.goBack();
    }

    callbackToParent = () => {
        const { isFieldsEdited } = this.state;
        const flag = isFieldsEdited;
        this.props.onUpdate(flag);
    }

    handleInputChange = (e, stateName) => {
        this.setState({ [stateName]: e.target.value, isFieldsEdited: true }, () => this.callbackToParent());
    }

    handleSelectChange = (e, stateName) => {
        const val = e.target.value;
        this.setState({ [stateName]: val, isFieldsEdited: true }, () => this.callbackToParent());
    }

    handleToastClose = () => {
        const navigateToFirstTab = this.props.playerStore.successMessage;
        this.props.playerStore.setToast(false);
        if (navigateToFirstTab)
            this.props.navigateToFirstTab();
    }

    APICallback = () => {

        const { identification1, identification2, comment1, comment2 } = this.state;

        this.props.playerStore.updateSSNAndVerifyPlayer(identification1, identification2, comment1, comment2);
    }

    onYes = () => {
        this.setState({ onYesClicked: true }, () => this.APICallback());
    }

    isSSNValid = (ssn) => {
        let re = /^\d{3}-?\d{2}-?\d{4}$/;
        return re.test(ssn);
    }

    isIdentificationValid = (identification) => {
        return identification && identification.trim().length > 0;
    }

    handleSSNOnClick = (e, stateName) => {
        this.props.playerStore.updateUserDetails('', stateName);
        this.setState({ isFieldsEdited: true }, () => this.callbackToParent());
    }

    handleSSNChange = (e, stateName) => {
        let val = e.target.value.replace(/\D/g, '');
        var newVal = '';
        if (val.length > 4) {
            this.value = val;
        }
        if ((val.length > 3) && (val.length < 6)) {
            newVal += val.substr(0, 3) + '-';
            val = val.substr(3);
        }
        if (val.length > 5) {
            newVal += val.substr(0, 3) + '-';
            newVal += val.substr(3, 2) + '-';
            val = val.substr(5);
        }
        newVal += val;
        this.props.playerStore.updateUserDetails(newVal, stateName);
    }

    render() {

        let isDisabled = false;

        const { showCancelPopup, identification1, identification2, comment1, comment2 } = this.state;

        const { showBackConfirm } = this.props;
        const { selectedPlayerDetails, showPlayerVerifyModal, selectedPlayerID } = this.props.playerStore;

        if (selectedPlayerDetails && selectedPlayerDetails.identity && selectedPlayerDetails.account) {
            const { identity, account } = selectedPlayerDetails;
            const {
                firstName, lastName, gender, dateOfBirth, ssn, phone, address1, address2, city, state, zip5,
                acceptedEmailCommunication, acceptedSmsCommunication, termsAcceptedDate, identityCheckResult
            } = identity;
            const { email, enabled } = account;

            isDisabled = !this.isSSNValid(ssn) || !this.isIdentificationValid(identification1) || !this.isIdentificationValid(identification2) && identityCheckResult === IdentityCheckResult.PASS;

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
                    <Modal show={showPlayerVerifyModal} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you would like to verify?
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
                                    {identityCheckResult !== IdentityCheckResult.PASS ?
                                        <AppTextbox type='text' maxlength='11' placeholder='Enter SSN' value={ssn}
                                            onChange={(e) => this.handleSSNChange(e, 'ssn')}
                                            onClick={(e) => this.handleSSNOnClick(e, 'ssn')}
                                        /> : <div className='player-details-value'>{ssn}</div>}
                                    {
                                        !this.isSSNValid(ssn) && identityCheckResult !== IdentityCheckResult.PASS
                                            ?
                                            <div className='player-invalid-email'>Update to Player's SSN is required in
                                                order to Verify.</div>
                                            : null
                                    }
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
                                    <input disabled={true} type="checkbox" checked={termsAcceptedDate} />
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Identity Check Result</div>
                                    <div className='player-details-value'>{identityCheckResult}</div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>Account Status</div>
                                    <div className='player-details-value'>{enabled ? 'Unlocked' : 'Locked'}</div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-2'>
                                    <div className='player-details-label'>Identification 1</div>
                                    <select value={identification1} disabled={identityCheckResult === IdentityCheckResult.PASS}
                                        onChange={(e) => this.handleSelectChange(e, 'identification1')}>
                                        <option selected disabled value="">Select</option>
                                        {
                                            KYCIdentificationOne.map(ki => {
                                                return <option value={ki}>{ki}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>&nbsp;</div>
                                    <textarea type="textarea" id="comment1" disabled={identityCheckResult === IdentityCheckResult.PASS}
                                        onChange={(e) => this.handleInputChange(e, 'comment1')}>{comment1}</textarea>
                                </div>
                                <div className='col-2'>
                                    <div className='player-details-label'>Identification 2</div>
                                    <select value={identification2} disabled={identityCheckResult === IdentityCheckResult.PASS}
                                        onChange={(e) => this.handleSelectChange(e, 'identification2')}>
                                        <option selected disabled value="">Select</option>
                                        {
                                            KYCIdentificationTwo.map(ki => {
                                                return <option value={ki}>{ki}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>&nbsp;</div>
                                    <textarea type="textarea" id="comment2" disabled={identityCheckResult === IdentityCheckResult.PASS}
                                        onChange={(e) => this.handleInputChange(e, 'comment2')}>{comment2}</textarea>
                                </div>
                                <div style={{ display: 'flex', width: '100%', height: 'auto', }}>
                                        <DisplayDocument name="DisplayDocument1" playerId={selectedPlayerID} />
                                        <DisplayDocument name="DisplayDocument2" playerId={selectedPlayerID} />
                                    
                                </div>
                                {/*<div className='col-2'>
                                    <div className='player-details-label'>&nbsp;</div>
                                    <a target="_blank" rel="noopener noreferrer"
                                       href='https://www.experian.com/'><Button
                                        className='player-details-btn'>Experian</Button></a>
                                </div>*/}
                            </div>
                        </div>
                        <hr className='separator' />
                        <div className='row player-button-row'>
                            <div className='offset-6 col-3 button-column'>
                                <Button disabled={isDisabled} className='player-details-btn'
                                    onClick={() => this.handleSubmit()}>
                                    Verify Player
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

export default KYCVerification;
