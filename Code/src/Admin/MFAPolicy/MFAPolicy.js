import React from 'react';
import {Button, Modal} from "react-bootstrap";
import "./MFAPolicy.css";
import AppTextbox from "../../AppTextbox";
import {inject, observer} from "mobx-react";
import AppToast from "../../toast";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";

@inject('settingsStore')
@observer
class MFAPolicy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: ['Custom', 'My IP'],
            isFieldsEdited: false,
            showCancelPopup: false
        };
    }

    componentDidMount() {
        this.props.settingsStore.getMFABypassRules();
    }

    handleToastClose = () => {
        this.props.settingsStore.setToast(false);
        this.props.history.goBack();
    }

    deleteRule = (id) => {
        this.props.settingsStore.deleteMFABypassRule(id);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    addRule = () => {
        this.props.settingsStore.addMFABypassRule('Test1', 'Descr1')
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    callbackToParent = () => {
        const {isFieldsEdited} = this.state;
        const flag = isFieldsEdited;
        this.props.onUpdate(flag);
    }

    handleInputChange = (e, stateName, id) => {

        e.preventDefault();

        let {inboundRules} = this.props.settingsStore;

        let inboundRule = inboundRules.find(rule => rule.id === id);

        if (stateName === 'ip') {
            if (inboundRule) {
                inboundRule.ip = e.target.value;
            }
        } else if (stateName === 'description') {
            if (inboundRule) {
                inboundRule.description = e.target.value;
            }
        }

        this.props.settingsStore.setMFABypassRules(inboundRules);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    handleSelectChange = (e, stateName, id) => {

        e.preventDefault();

        let {inboundRules} = this.props.settingsStore;

        let inboundRule = inboundRules.find(rule => rule.id === id);

        if (stateName === 'source') {
            if (inboundRule) {
                inboundRule.source = e.target.value;
                if (e.target.value === 'My IP') {
                    inboundRule.ip = this.props.settingsStore.getMyIPAddress();
                }
            }
        }

        this.props.settingsStore.setMFABypassRules(inboundRules);
        this.setState({isFieldsEdited: true}, () => this.callbackToParent());
    }

    /**
     * Saves all the Bypass Rules
     */
    onYes = () => {
        this.props.settingsStore.saveMFABypassRules();
    }

    handleSubmit = () => {
        this.props.settingsStore.setShowConfirmSaveModal(true);
    }

    onSubmitCancel = () => {
        this.props.settingsStore.setShowConfirmSaveModal(false)
    }

    onRejectCancel = () => {
        this.setState({showCancelPopup: false}, () => this.props.handlePopup(false));
    }

    onCancel = (e) => {
        e.preventDefault();
        this.props.settingsStore.discardMFABypassRuleChanges();
        this.props.history.goBack();
    }

    handleCancel = () => {
        if (this.state.isFieldsEdited)
            this.setState({showCancelPopup: true});
        else
            this.props.history.goBack();
    }

    isIPAddressValid = (IPAddress) => {
        let blocks = IPAddress.split(".");
        if (blocks.length === 4 && blocks[3] !== '') {
            for (let i = 0; i < blocks.length; i++) {
                if (Number(blocks[i]) < 0 || Number(blocks[i]) > 255) {
                    return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }

    isDescriptionValid = (description) => {
        return description && description.trim().length > 0;
    }

    renderMFAPolicy() {

        const {sources, showCancelPopup} = this.state;
        const {showBackConfirm} = this.props;
        const {inboundRules, showConfirmSaveModal, showToast, successMessage, errorMessage} = this.props.settingsStore;

        // Disable [Save Rules] if needed
        let isDisabled = true;
        let rule;
        for (rule of inboundRules) {
            isDisabled = !this.isIPAddressValid(rule.ip) || !this.isDescriptionValid(rule.description)
        }

        return (

            <div className='player-details-container container-fluid '>
                {showToast
                    ?
                    <AppToast showToast={showToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }
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
                <Modal show={showConfirmSaveModal} centered={true}>
                    <Modal.Body>
                        <div className='player-details-label'>
                            Are you sure you would like to Save?
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={(e) => this.onSubmitCancel(e)}>No</Button>
                        <Button variant='primary' onClick={() => this.onYes()}>Yes</Button>
                    </Modal.Footer>
                </Modal>

                <div className='player-details-panel'>
                    <div className='inbound-rule-container'>
                        <div className='row'>
                            <div className='col-3 inbound-rule-label'>Source</div>
                            <div className='col-4 inbound-rule-label'>IP Address</div>
                            <div className='col-4 inbound-rule-label'>Description</div>
                        </div>
                        {
                            inboundRules.map(rule => {
                                return <div className='row'>
                                    <div className='col-3 rule-select'>
                                        <select value={rule.source} className='form-control'
                                                onChange={(e) => this.handleSelectChange(e, 'source', rule.id)}>
                                            {
                                                sources.map(source => {
                                                    return <option value={source}>{source}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='col-4'>
                                        <AppTextbox controlId='description' value={rule.ip || ''}
                                                    disabled={(rule.source === 'My IP')}
                                                    onChange={(e) => this.handleInputChange(e, 'ip', rule.id)}/>
                                        {
                                            !this.isIPAddressValid(rule.ip)
                                                ? <div className='player-invalid-email'>Invalid IP Address</div>
                                                : null
                                        }
                                    </div>
                                    <div className='col-4'>
                                        <AppTextbox controlId='description' value={rule.description}
                                                    onChange={(e) => this.handleInputChange(e, 'description', rule.id)}/>
                                        {
                                            !this.isDescriptionValid(rule.description)
                                                ? <div className='player-invalid-email'>Enter a description</div>
                                                : null
                                        }
                                    </div>
                                    <div className='col-1'>
                                        <Button variant='danger' onClick={(e) => this.deleteRule(rule.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            })
                        }
                        <div className='row'>
                            <div className='col-3'>
                                <Button variant='primary' onClick={(e) => this.addRule(e)}>
                                    Add Rule
                                </Button>
                            </div>
                            <div className='col-3 button-panel'>
                                <Button variant='warning' onClick={(e) => this.handleCancel(e)}>
                                    Cancel
                                </Button>
                                <Button variant='primary' disabled={isDisabled} onClick={(e) => this.handleSubmit(e)}>
                                    Save Rules
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

        if (checkRenderPermissions(permissions.CAN_EDIT_MFA_BYPASS_RULES, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderMFAPolicy();
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

export default MFAPolicy;
