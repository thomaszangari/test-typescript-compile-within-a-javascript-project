import React from "react";
import {inject, observer} from "mobx-react";
import './ClaimDetails.css';
import {toJS} from "mobx";
import ReactTable from "../../PaginatedTable/ReactTable";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import {Button, Modal} from "react-bootstrap";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import AppTextbox from "../../AppTextbox";
import AppToast from "../../toast";
import SigContainer from '../../components/sigcontainer/sigcontainer';

@inject('playerStore', 'claimStore')
@observer
class ClaimDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showConfirmModal: false,
            showSigModal: false,
            routingNumber: '',
            confirmRoutingNumber: '',
            accountNumber: '',
            confirmAccountNumber: '',
            bankName: null,
            accountTypes: ['CHECKING', 'SAVINGS'],
            selectedAccount: 'CHECKING',
            showToast: false
        };
    }

    onClose = (e) => {
        //this.props.playerStore.clearESig();
        this.setState({showSigModal: false});
    }

    componentDidMount() {
        this.props.playerStore.fetchClaimDetails();
        this.props.playerStore.fetchPaymentHistoryDetails();
    }

    handleW2GFormButtonClick = () => {
        this.props.playerStore.fetchW2GFormForClaim();
    }

    handleESigFormButtonClick = () => {
        //this.props.playerStore.fetchESigFormForClaim();

        if(this.props.playerStore.eSignatureURL && this.props.playerStore.eSignatureURL != ''){
            this.props.playerStore.logAction(UserActionCategory.BUTTON_CLICK, UserAction.VIEW_ESIGNAURE, 'Claim ID: '+this.props.playerStore.selectedClaimId, '');
            this.setState({showSigModal: true})
        } else {
            this.props.playerStore.logAction(UserActionCategory.BUTTON_CLICK, UserAction.VIEW_ESIGNAURE_FAILED, 'Claim ID: '+this.props.playerStore.selectedClaimId, 'No E-Signature Link Provided');
            this.setState({showToast: true})
        }
        //this.setState({showSigModal: true});
    }

    handleClaimHistoryDetailClick = () => {
        // alert('Claim history click')
    }

    handlePaymentDetailClick = (paymentData) => {
        this.props.playerStore.logAction(UserActionCategory.API_CALL, UserAction.VIEW_PAYMENT_DETAILS, 'Transaction ID: '+paymentData.transactionId, '');
        this.props.playerStore.setPaymentDetails(paymentData, this.navigateToPaymentDetails);
    }

    navigateToPaymentDetails = () => {
        const id  = this.props.playerStore.selectedClaimId;
        this.props.history.push(`/claim/${id}/paymenthistory`);
    }

    handleRepaymentButtonClick = () => {
        this.setState({showModal: true});
    }

    handleInputChange = (event, stateName) => {
        const {value} = event.target;
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value)) {
            this.setState({[stateName]: value});
        }
    }

    handleRoutingInputChange = async (event, stateName) => {
        const {value} = event.target;
        let bankName = null;
        const {playerStore} = this.props;
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value)) {
            if(value.length === 9) {
                playerStore.setSpinnerState(true);
                await fetch(`https://www.routingnumbers.info/api/name.json?rn=${value}`, {
                    method: 'GET',
                })
                    .then(response => response.json())
                    .then(res => {
                        if(res.code === 200) {
                            bankName = res.name;
                            this.setState({[stateName]: value, bankName});
                        } else {
                            this.setState({[stateName]: value});
                        }
                        playerStore.setSpinnerState(false);
                    })
                    .catch((error) => {
                        this.errorMessage = error.toString();
                        playerStore.setSpinnerState(false);
                    });
            } else {
                this.setState({[stateName]: value, bankName});
            }
        }


    }

    handleResubmitPayment = (referenceNumber) => {
        const {routingNumber, accountNumber, selectedAccount} = this.state;
        this.props.claimStore.resubmitACHPayment(referenceNumber, accountNumber, routingNumber, selectedAccount);
    }
    onYes = (referenceNumber) => {
        this.setState({showConfirmModal: false}, () => this.handleResubmitPayment(referenceNumber));
    }
    onNo = () => {
        this.setState({showConfirmModal: false, showModal:true});
    }
    onSubmit = () => {
        this.setState({showConfirmModal: true, showModal: false});
    }
    onCancel = () => {
        this.setState({showModal: false});
    }

    onAccountTypeChange = event => {
        this.setState({selectedAccount: event.target.value});
    }

    handleToastClose = () => {
        this.setState({showToast: false});
    }


    renderClaimDetails() {
        if(this.props.playerStore.claimDetails && this.props.playerStore.selectedClaimId) {

            const {showModal, showConfirmModal, showSigModal, routingNumber, confirmRoutingNumber, accountNumber,
                confirmAccountNumber, bankName, accountTypes, selectedAccount, showToast} = this.state;
            const {isSpinnerLoading} = this.props.playerStore;
            let isSubmitDisabled = true;
            
            if(routingNumber && confirmRoutingNumber && confirmAccountNumber && accountNumber && bankName &&
                routingNumber.length === 9 && confirmAccountNumber === accountNumber &&
                confirmRoutingNumber === routingNumber) {
                isSubmitDisabled = false;
            }
            

            const data = toJS(this.props.playerStore.claimDetails)
            const paymentHistoryTableRows = toJS(this.props.playerStore.paymentHistoryData);
            const {selectedClaimDetails, claimHistoryTableHeader, claimHistoryTableRows, eSignatureData} = data;
            const paymentHistoryTableHeader =  [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'transactionId', label: 'Transaction ID'},
                {key: 'amount', label: 'Amount', classes: 'currency-column'},
                {key: 'status', label: 'Status'},
            ];
            let rejectedCounter = 0;
            if(checkRenderPermissions(permissions.CAN_SEE_CLAIM_TRANSACTION_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
                if(paymentHistoryTableRows && paymentHistoryTableRows.length > 0) {
                    paymentHistoryTableHeader.push({key: 'view', label: 'View Details'});
                    paymentHistoryTableRows.forEach(row => {
                        if(row.status === 'REJECTED') {
                            rejectedCounter++;
                        }
                        row.view = <a onClick={() => this.handlePaymentDetailClick(row)} className='claim-link'>View Details</a>
                    });
                }
            }


            const {referenceNumber, serialNumber, barcode, ticketSerialNumber, ticketBarcode, prizeAmountInCents, taxWithholding,
                offsetWithholding, status, netPaymentAmountInCents, rejectedCount} = selectedClaimDetails;
            const canSeeESig = checkRenderPermissions(permissions.CAN_SEE_E_SIGNATURE,
                JSON.parse(localStorage.getItem('userpolicies')));
            const canSeeW2G = checkRenderPermissions(permissions.CAN_SEE_CLAIM_W2G,
                JSON.parse(localStorage.getItem('userpolicies')));

            const isResubmitDisabled = checkRenderPermissions(permissions.CAN_RESUBMIT_PAYMENT,
                JSON.parse(localStorage.getItem('userpolicies')));

            // claimHistoryTableRows.forEach(row => row.view = <a onClick={() => this.handleClaimHistoryDetailClick()} className='claim-link'>View Details</a>);

            const isButtonEnabled = !(status === 'READY_FOR_PAYMENT' && rejectedCounter === 1);
            return(
                <div className='claim-container container-fluid'>
                    {showToast
                    ?
                    <AppToast showToast={showToast}
                              message={'No Signature found for Claim'}
                              isSuccessMessage={false}
                              handleClose={null}/>
                    : null
                }
                    <div className='claim-panel'>
                        <div className='claim-top-row'>
                            <div className='claim-top-column'>
                                <div>
                                    Reference #
                                </div>
                                <div>
                                    {referenceNumber}
                                </div>
                            </div>
                            <div className='claim-top-column big-column'>
                                <div>
                                    Ticket Serial #
                                </div>
                                <div>
                                    {serialNumber}
                                </div>
                            </div>
                            <div className='claim-top-column big-column'>
                                <div>
                                    Ticket Barcode
                                </div>
                                <div>
                                    {barcode}
                                </div>
                            </div>
                            <div className='claim-top-column'>
                                <div>
                                    Prize Amount
                                </div>
                                <div>
                                    ${prizeAmountInCents ?  (prizeAmountInCents/100).toFixed(2) : 0}
                                </div>
                            </div>
                            <div className='claim-top-column'>
                                <div>
                                    Tax Withholding
                                </div>
                                <div>
                                    ${taxWithholding}
                                </div>
                            </div>
                            <div className='claim-top-column'>
                                <div>
                                    Offset Withholding
                                </div>
                                <div>
                                    ${offsetWithholding}
                                </div>
                            </div>
                            <div className='claim-top-column'>
                                <div>
                                    Net Amount
                                </div>
                                <div>
                                    ${netPaymentAmountInCents && netPaymentAmountInCents/100}
                                </div>
                            </div>
                            <div className='claim-top-column'>
                                <div>
                                    Status
                                </div>
                                <div>
                                    {status}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal size='lg' show={showSigModal} className={`${``} role-modal`}>
                        <Modal.Header>
                            <h5>{'E-Signature'}</h5>
                        </Modal.Header>
                        <Modal.Body>
                            <SigContainer/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onClose(e)}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    {
                        claimHistoryTableHeader && claimHistoryTableRows
                            ? <ReactTable tableHeader={claimHistoryTableHeader} rowData={claimHistoryTableRows}
                                          className='claim-panel' header='Claim History'/>
                            : null
                    }
                    {
                        paymentHistoryTableHeader && paymentHistoryTableRows
                            ? <ReactTable tableHeader={paymentHistoryTableHeader} rowData={paymentHistoryTableRows}
                                          className='claim-panel' header='Payment History'/>
                            : null
                    }
                    {
                        canSeeESig
                            ? <Button className='view-sig-button' onClick={() => this.handleESigFormButtonClick()}>
                                View E-Signature
                            </Button>
                            : null
                    }
                    {
                        canSeeW2G
                            ? <Button className='view-pdf-button' onClick={() => this.handleW2GFormButtonClick()}>
                                View W2G
                            </Button>
                            : null
                    }
                    {
                        isResubmitDisabled
                            ? <Button
                                disabled={isButtonEnabled}
                                className='resubmit-button'
                                onClick={() => this.handleRepaymentButtonClick()}>
                                Resubmit Payment
                            </Button>
                            : null
                    }

                    <Modal show={showModal} centered={true}>
                        <Modal.Header>
                            Resubmit Payment
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <AppTextbox controlId='formGroupRoleName'
                                            placeholder='Routing Number'
                                            value={routingNumber}
                                            disabled={isSpinnerLoading}
                                            maxlength={9}
                                            onChange={(e) => this.handleRoutingInputChange(e, 'routingNumber')}
                                />
                                {
                                    routingNumber && bankName === null
                                        ? <div className='warning-message'>Does Not Match Known Banks</div>
                                        : null
                                }
                                {
                                    bankName ? <div className='bank-name'>{bankName}</div> : null
                                }
                                <AppTextbox controlId='formGroupRoleName'
                                            placeholder='Re-Enter Routing Number'
                                            value={confirmRoutingNumber}
                                            disabled={isSpinnerLoading}
                                            maxlength={9}
                                            onChange={(e) => this.handleInputChange(e, 'confirmRoutingNumber')}
                                />
                                {
                                    routingNumber && confirmRoutingNumber && routingNumber !== confirmRoutingNumber
                                        ? <div className='warning-message'>Routing Numbers Do Not Match</div>
                                        : null
                                }
                                <AppTextbox controlId='formGroupRoleName'
                                            placeholder='Account Number'
                                            value={accountNumber}
                                            disabled={isSpinnerLoading}
                                            onChange={(e) => this.handleInputChange(e, 'accountNumber')}
                                />
                                <AppTextbox controlId='formGroupRoleName'
                                            placeholder='Re-Enter Account Number'
                                            value={confirmAccountNumber}
                                            disabled={isSpinnerLoading}
                                            onChange={(e) => this.handleInputChange(e, 'confirmAccountNumber')}
                                />
                                {
                                    accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber
                                        ? <div className='warning-message'>Account Numbers Do Not Match</div>
                                        : null
                                }
                                <div className='account-type-label'>Account Type</div>
                                <select className='form-control account-select' value={selectedAccount} onChange={this.onAccountTypeChange}>
                                    {
                                        accountTypes.map(account => {
                                            return <option value={account}>{account}</option>
                                        })
                                    }
                                </select>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onCancel(e)}>
                                Cancel
                            </Button>
                            <Button variant='primary' disabled={isSubmitDisabled}
                                    onClick={(e) => this.onSubmit(e)}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showConfirmModal} centered={true}>
                        <Modal.Body>
                            <div className='player-details-label'>
                                Are you sure you wish to submit this Payment?
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onNo(e)}>No</Button>
                            <Button variant='primary' onClick={() => this.onYes(referenceNumber)}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        }
        return(
            <div className='claim-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>
        )
    }

    render() {

        let renderObj;

        if (checkRenderPermissions(permissions.CAN_SEE_CLAIMS, JSON.parse(localStorage.getItem('userpolicies')))
            && checkRenderPermissions(permissions.CAN_SEE_CLAIM_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderClaimDetails();
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

export default ClaimDetails;