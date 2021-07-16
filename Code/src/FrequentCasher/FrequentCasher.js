import React from "react";
import {Button, Modal} from "react-bootstrap";
import './FrequentCasher.css'
import {checkRenderPermissions} from '../helpers';
import {permissions} from '../constants';
import AppTextbox from "../AppTextbox";
import {inject, observer} from "mobx-react";

@inject('playerStore')
@observer
class FrequentCasher extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            ssn: '',
            errorMessage: '',
            showError: false,
            showSuccess: false,
            successMessage: '',
            showToast: false,
            showCancelPopup: false,
            onYesClicked: false,
            isValidSSN: false,
            isLastNameAtLeastLength3: false,
            isAdd: false,
        }
    }

    // [Add]
    handleAdd = () => {
        this.setState({isAdd: true}, () => this.props.playerStore.setShowFrequentCasherConfirmModal(true));
    }

    // [Remove]
    handleRemove = () => {
        this.setState({isAdd: false}, () => this.props.playerStore.setShowFrequentCasherConfirmModal(true));
    }

    // [No]
    onSubmitCancel = () => {
        this.props.playerStore.setShowFrequentCasherConfirmModal(false)
    }

    // [Yes]
    onYesForAdd = () => {
        const {firstName, lastName, ssn} = this.state;
        this.props.playerStore.AddFrequentCasher(firstName, lastName, ssn);
    }

    // [Yes]
    onYesForRemove = () => {
        const {firstName, lastName, ssn} = this.state;
        this.props.playerStore.RemoveFrequentCasher(firstName, lastName, ssn);
    }

/*    handleToastClose = () => {
        this.props.playerStore.setToast(false);
    }*/

    handleInputChange = (e, stateName) => {

        if (stateName === 'firstName') {
            const regExp = /^[a-zA-Z]*$/;
            if (e.target.value.trim() !== '' || (regExp.test(e.target.value))) {
                this.setState({[stateName]: e.target.value.trim()});
            }
        } else if (stateName === 'lastName') {
            const regExp = /^[a-zA-Z]*$/;
            if (e.target.value.trim() !== '' || (regExp.test(e.target.value))) {
                this.setState({
                    [stateName]: e.target.value.trim(),
                    isLastNameAtLeastLength3: e.target.value.length >= 3
                });
            }
        } else if (stateName === 'ssn') {
            const re = /^[0-9\b]+$/;
            if (e.target.value === '' || re.test(e.target.value)) {
                this.setState({
                    [stateName]: e.target.value,
                    isValidSSN: e.target.value.length === 9
                });
            }
        }
    }

    renderFrequentCasher() {

        const {showFrequentCasherConfirmModal, showToast, successMessage, errorMessage} = this.props.playerStore;
        const {firstName, lastName, ssn, isAdd, isValidSSN, isLastNameAtLeastLength3} = this.state;

        let isDisabled = true;
        if (isLastNameAtLeastLength3 && isValidSSN) {
            isDisabled = false
        }

        return (
            <div className='frequentcasher-details-container container-fluid '>
                {/*{showToast
                    ?
                    <AppToast showToast={showToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }*/}
                <Modal show={showFrequentCasherConfirmModal} centered={true}>
                    <Modal.Body>
                        <div className='frequentcasher-details-label'>
                            {isAdd ? 'Are you sure you wish to add this Player to the Frequent Casher List?' : 'Are you sure you wish to remove this Player from the Frequent Casher List?'}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={(e) => this.onSubmitCancel(e)}>No</Button>
                        {isAdd ?
                            <Button variant='primary' onClick={(e) => this.onYesForAdd(e)}>Yes</Button>
                            : <Button variant='primary' onClick={(e) => this.onYesForRemove(e)}>Yes</Button>
                        }
                    </Modal.Footer>
                </Modal>
                <div className='frequentcasher-details-panel'>
                    <div className='frequentcasher-details-child '>
                        <div className='row'>
                            <div className='col-2'>
                                <div className='frequentcasher-details-label'>First Name</div>
                                <AppTextbox type='text' placeholder='Enter First Name ' value={firstName}
                                            onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                            </div>
                            <div className='col-2'>
                                <div className='frequentcasher-details-label'>Last Name</div>
                                <AppTextbox type='text' placeholder='Enter last Name ' value={lastName}
                                            onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                            </div>
                            <div className='col-2'>
                                <div className='frequentcasher-details-label'>SSN</div>
                                <AppTextbox type='text' placeholder='Enter SSN ' maxlength='9' value={ssn}
                                            onChange={(e) => this.handleInputChange(e, 'ssn')}/>
                            </div>
                            <div className='col-2'>
                                <Button disabled={isDisabled} className='frequentcasher-details-btn'
                                        onClick={() => this.handleAdd()}>
                                    Add
                                </Button>
                            </div>
                            <div className='col-2'>
                                <Button disabled={isDisabled} className='frequentcasher-details-btn'
                                        onClick={() => this.handleRemove()}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.CAN_ACCESS_SECURITY_MODULE, JSON.parse(localStorage.getItem('userpolicies')))
            && checkRenderPermissions(permissions.CAN_ACCESS_FREQUENT_CASHER_MODULE, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderFrequentCasher();
        } else {
            renderObj =
                <h1 class='unauthorized-header'>You do not have permission to view this page! Please contact your System
                    Administrator!</h1>
        }

        return (
            renderObj
        );
    }
}

export default FrequentCasher;