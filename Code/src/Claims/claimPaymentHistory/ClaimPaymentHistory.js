import React from "react";
import {inject, observer} from "mobx-react";
import {Button, Modal} from "react-bootstrap";
import {toJS} from "mobx";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
// import {UserAction, UserActionCategory} from "../../UserActionCategory";
import './ClaimPaymentHistory.css';

@inject('playerStore')
@observer
class ClaimPaymentHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    setModalState = (flag) => {
        this.setState({showModal: flag});
    }
    render() {
        const {showModal} = this.state;
        const canSeeAccountData = checkRenderPermissions(permissions.CAN_SEE_CLAIM_TRANSACTION_PII,
            JSON.parse(localStorage.getItem('userpolicies')));

        debugger;
        const paymentDetails = toJS(this.props.playerStore.paymentDetails);
        if(!paymentDetails) {
            return <div className='claim-payment-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>
        }
        const {date, amount, status, achAccount} = paymentDetails;
        const {achAccountType, achAccountNumber, achRoutingNumber} = achAccount;
        return (
            <div className='claim-payment-container container-fluid'>
                <div className='claim-payment-panel'>
                    <div className='row claim-payment-panel-row'>
                        <div className='col-4'>
                            <div>Date of Submission</div>
                            <div>{date}</div>
                        </div>
                        <div className='col-4'>
                            <div>Amount</div>
                            <div>${amount}</div>
                        </div>
                        <div className='col-4'>
                            <div>Status</div>
                            <div>{status}</div>
                        </div>
                    </div>
                    <div className='row claim-payment-panel-row'>
                        <div className='col-4'>
                            <div>Account Type</div>
                            <div>{achAccountType || ''}</div>
                        </div>
                        <div className='col-4'>
                            <div>Account Number</div>
                            <div>**********</div>
                        </div>
                        <div className='col-4'>
                            <div>Routing Number</div>
                            <div>**********</div>
                        </div>
                    </div>
                    <div>
                        {
                            canSeeAccountData
                            ? <Button
                                    className='show-detail-button'
                                    onClick={() => this.setModalState(true)}>
                                    Show Details
                                </Button>
                            : null
                        }

                    </div>
                    {/*Date, amount, Status, achAccountType, achAccountNumber,achRoutingNumber*/}
                </div>
                <Modal show={showModal} centered={true}>
                    <Modal.Header>
                        <h5> Account Information </h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal-unmasked-detail'>
                            Account Number: {achAccountNumber}
                        </div>
                        <div className='modal-unmasked-detail'>
                            Routing Number: {achRoutingNumber}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => this.setModalState(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ClaimPaymentHistory;
