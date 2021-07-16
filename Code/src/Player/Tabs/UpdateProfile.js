import React from "react";
import {Button, Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import AppTextbox from "../../AppTextbox";
import DatePicker from "react-datepicker";
import {AddressStateCodes} from "../../Constants/AddressStateCodes";
import {GenderCodes} from "../../Constants/GenderCodes";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";

@inject('playerStore')
@observer
class UpdateProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isValidEmail: false,
            isValidPhone: false,
            isFieldsEdited: false,
            showCancelPopup: false,
            onYesClicked: false
        }
    }

    handleSubmit = () => {
        this.props.playerStore.setShowUpdateModal(true);
    }
    onSubmitCancel = () => {
        this.props.playerStore.setShowUpdateModal(false)
    }
    onRejectCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(false));
    }
    onCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(true));
    }

    handleCancel = () => {
        if (this.state.isFieldsEdited)
            this.setState({showCancelPopup: true});
        else
            this.props.history.goBack();
    }

    handleToastClose = () => {
        const navigateToFirstTab = this.props.playerStore.successMessage;
        this.props.playerStore.setToast(false);
        if (navigateToFirstTab)
            this.props.navigateToFirstTab();
    }

    callbackToParent = () => {
        const {isFieldsEdited} = this.state;
        const flag = isFieldsEdited;
        this.props.onUpdate(flag);
    }

    handleSSNOnClick = (e, stateName) => {
        //const val = e.target.value;
        this.props.playerStore.updateUserDetails('', stateName);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleSSNChange = (e, stateName) => {
        let val = e.target.value.replace(/\D/g, '');
        //var val = this.value.replace(/\D/g, '');
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
        //this.value = newVal;
        this.props.playerStore.updateUserDetails(newVal, stateName);
    }


    handleInputChange = (e, stateName) => {
        const val = e.target.value;
        this.props.playerStore.updateUserDetails(val, stateName);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    isEmailValid = (email) => {
        return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    }

    isPhoneNumberValid = (phone) => {
        return phone.match(/^[0-9\b]+$/) && phone.length == 10;
    }

    isZipcodeValid = (zip5) => {
        return zip5.match(/^[0-9\b]+$/) && zip5.length == 5;
    }

    isAddr1Valid = (addr1) => {
        return addr1 && addr1.trim().length > 0;
    }

    isCityValid = (city) => {
        return city && city.trim().length > 0;
    }

    isStateValid = (addrState) => {
        return addrState && addrState.trim().length > 0;
    }

    isSSNValid = (ssn) => {
        return ssn && ssn.trim().length == 11;
    }

    handleEmailChange = (e, stateName) => {
        const val = (e.target.value);
        this.props.playerStore.updateUserEmail(val, stateName);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleCheckboxChange = (e, stateName) => {
        let val = (e.target.checked);
        if (stateName === 'termsAcceptedDate') {
            val = val ? new Date(val) : null;
        }
        this.props.playerStore.updateUserDetails(val, stateName);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleSelectChange = (e, stateName) => {
        const value = e.target.value;
        if (stateName === 'gender') {
            this.props.playerStore.updateUserDetails(value, 'gender');
        } else if (stateName === 'state') {
            this.props.playerStore.updateUserDetails(value, 'state');
        }
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleDateChange = (selected) => {
        let dateString = new Date(selected);
        let monthString = dateString.getMonth() + 1;
        let dayString = dateString.getDate();
        let yearString = dateString.getFullYear();
        let timeString = 'T00:00:00';
        dateString = yearString + "-" + ("0" + monthString).slice(-2) + "-" + ("0" + dayString).slice(-2) + "" + timeString;
        this.props.playerStore.updatePlayerDateOfBirth(dateString);
    }

    APICallback = () => {
        this.props.playerStore.updatePlayer();
    }

    onYes = () => {
        this.setState({onYesClicked: true}, () => this.APICallback());
    }

    render() {

        let isDisabled = false;

        let date18YearAgo = new Date();
        date18YearAgo.setFullYear(date18YearAgo.getFullYear() - 18)

        const {showBackConfirm} = this.props;
        const {selectedPlayerDetails, showUpdateModal, showToast, successMessage, errorMessage} = this.props.playerStore;

        if (selectedPlayerDetails && selectedPlayerDetails.identity && selectedPlayerDetails.account) {

            const {showCancelPopup} = this.state;

            const {identity, account} = selectedPlayerDetails;
            const {
                firstName, lastName, gender, dateOfBirth, ssn, phone, address1, address2, city, state, zip5,
                acceptedEmailCommunication, acceptedSmsCommunication, termsAcceptedDate
            } = identity;
            const {email} = account;

            isDisabled = !this.isEmailValid(email) || !this.isPhoneNumberValid(phone) || !this.isZipcodeValid(zip5) ||
                !this.isAddr1Valid(address1) || !this.isCityValid(city) ||
                !this.isStateValid(state) || !this.isSSNValid(ssn);

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
                    <Modal show={showUpdateModal} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you would like to Submit?
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
                                    <AppTextbox type='text' placeholder='Enter First Name ' value={firstName}
                                                onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Last Name</div>
                                    <AppTextbox type='text' placeholder='Enter last Name ' value={lastName}
                                                onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>SSN</div>
                                    {checkRenderPermissions(permissions.CAN_UPDATE_PLAYER_SSN, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                        <AppTextbox type='text' maxlength='11' placeholder='Enter SSN' value={ssn}
                                                    onChange={(e) => this.handleSSNChange(e, 'ssn')}
                                                    onClick={(e) => this.handleSSNOnClick(e, 'ssn')}
                                        /> :
                                        <div className='player-details-value'>{ssn}</div>}
                                    {
                                        !this.isSSNValid(ssn)
                                            ? <div className='player-invalid-email'>Invalid SSN</div>
                                            : null
                                    }
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Date of Birth</div>
                                    <DatePicker popperPlacement="bottom-end"
                                                selected={dateOfBirth ? new Date(dateOfBirth): null}
                                                maxDate={date18YearAgo}
                                                onChange={date => this.handleDateChange(date)}/>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>Gender</div>
                                    <select value={gender} onChange={(e) => this.handleSelectChange(e, 'gender')}>
                                        <option selected disabled value="">Select</option>
                                        {
                                            GenderCodes.map(g => {
                                                return <option value={g}>{g}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Mailing Address 1</div>
                                    <AppTextbox type='text' placeholder='Enter address1 ' value={address1}
                                                onChange={(e) => this.handleInputChange(e, 'address1')}/>
                                    {
                                        !this.isAddr1Valid(address1)
                                            ? <div className='player-invalid-email'>Invalid Address 1</div>
                                            : null
                                    }
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Mailing Address 2</div>
                                    <AppTextbox type='text' placeholder='Enter address2 ' value={address2}
                                                onChange={(e) => this.handleInputChange(e, 'address2')}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>City</div>
                                    <AppTextbox type='text' placeholder='Enter city' value={city}
                                                onChange={(e) => this.handleInputChange(e, 'city')}/>
                                    {
                                        !this.isCityValid(city)
                                            ? <div className='player-invalid-email'>Invalid City</div>
                                            : null
                                    }
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>State</div>
                                    <select value={state} onChange={(e) => this.handleSelectChange(e, 'state')}>
                                        <option selected disabled value="">Select</option>
                                        {
                                            AddressStateCodes.map(g => {
                                                return <option value={g}>{g}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Zipcode</div>
                                    <AppTextbox type='text' placeholder='Enter zipcode ' value={zip5} maxlength='5'
                                                onChange={(e) => this.handleInputChange(e, 'zip5')}/>
                                    {
                                        !this.isZipcodeValid(zip5) && zip5.length
                                            ? <div className='player-invalid-email'>Invalid Zipcode</div>
                                            : null
                                    }
                                </div>

                                <div className='col-3'>
                                    <div className='player-details-label'>Email</div>
                                    <AppTextbox type='text' placeholder='Enter email ' value={email}
                                                onChange={(e) => this.handleEmailChange(e, 'email')}/>
                                    {
                                        !this.isEmailValid(email) && email.length
                                            ? <div className='player-invalid-email'>Invalid Email</div>
                                            : null
                                    }
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Phone</div>
                                    <AppTextbox type='text' placeholder='Enter Cellphone ' value={phone}
                                                maxlength='10'
                                                onChange={(e) => this.handleInputChange(e, 'phone')}/>
                                    {
                                        !this.isPhoneNumberValid(phone) && phone.length
                                            ? <div className='player-invalid-email'>Phone should be 10 digit</div>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='player-details-label'>Email Opt-In</div>
                                    <input type="checkbox" id="EmailOptInCheck" checked={acceptedEmailCommunication}
                                           onChange={(e) => this.handleCheckboxChange(e, 'acceptedEmailCommunication')}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>SMS Opt-In</div>
                                    <input type="checkbox" id="SMSOptInCheck" checked={acceptedSmsCommunication}
                                           onChange={(e) => this.handleCheckboxChange(e, 'acceptedSmsCommunication')}/>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>T&C Terms Accept</div>
                                    <input type="checkbox" id="TnCTermsAcceptCheck" checked={termsAcceptedDate}
                                           disabled={true}/>
                                </div>
                            </div>
                        </div>
                        <hr className='separator'/>
                        <div className='row player-button-row'>
                            <div className='offset-6 col-3 button-column'>
                                <Button disabled={isDisabled} className='player-details-btn'
                                        onClick={() => this.handleSubmit()}>
                                    Submit
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

export default UpdateProfile;
