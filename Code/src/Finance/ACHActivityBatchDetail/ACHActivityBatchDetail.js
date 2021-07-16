import React from "react";
import {inject, observer} from "mobx-react";
import {Button, Modal} from "react-bootstrap";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import {toJS} from "mobx";
import moment from "moment";
import {checkRenderPermissions} from "../../helpers";
import {permissions, timeOfDayFormat} from "../../constants";
import ReactTable from "../../PaginatedTable/ReactTable";

import './ACHActivityBatchDetail.css';

@inject('claimStore', 'playerStore')
@observer
class ACHActivityBatchDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            selectedBatch: null,
        }
    }

    componentDidMount() {
        if(checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            this.props.claimStore.fetchBatchDetails();
        }
    }

    handlePaymentDetailClick = (paymentData) => {
        this.props.claimStore.logAction(UserActionCategory.API_CALL, UserAction.VIEW_PAYMENT_DETAILS, 'Transaction ID: '+paymentData.transactionId, '');
        this.props.claimStore.setPaymentDetails(paymentData, this.navigateToPaymentDetails);
    }

    navigateToPaymentDetails = () => {
        const id  = this.props.claimStore.selectedClaimId;
        this.props.history.push(`/claim/${id}/paymenthistory`);
    }

    handleViewDetailClick = (row) => {
        const target = row.transactionid;
        const playerName = `${row.playerfirstname} ${row.playerlastname}`;
        this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.SHOW_BATCH_FILE_PII, 'Transaction ID: '+target, 'Player Name: '+playerName);
        this.setState({showPopup: true, selectedBatch: row});
    }

    onModalClose = () => {
        this.setState({showPopup: false, selectedBatch: null});
    }

    renderBatchDetails() {
        const {batchDetails, selectedBatchId} = this.props.claimStore;
        const {showPopup, selectedBatch} = this.state;
        if(batchDetails && selectedBatchId) {

            const data = toJS(this.props.claimStore.batchDetails)
            const {selectedBatchDetails, batchDetailsTableHeader, batchDetailsTableRows} = data;
            const {filecreationdatetime, filesubmissiondatetime, effectiveentrydate,
                settlementdate, status, amount} = selectedBatchDetails;
            if(checkRenderPermissions(permissions.CAN_SEE_BATCH_MASKED_DETAIL, JSON.parse(localStorage.getItem('userpolicies')))) {
                batchDetailsTableHeader.push({key: 'view', label: ''});
                batchDetailsTableRows.forEach((row, index) => {
                    row.view = <a key={index} className='batch-detail-link' onClick={() => this.handleViewDetailClick(row)}>
                        Show Details
                    </a>;
                });
            }
            return(
                <div className='batch-detail-container container-fluid'>
                    <div className='batch-detail-panel'>
                        <div className='batch-detail-top-row'>
                            <div className='batch-detail-top-column'>
                                <div>
                                    File Creation Date #
                                </div>
                                <div>
                                    {moment(filecreationdatetime).format('MM-DD-YYYY')}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    File Creation Time
                                </div>
                                <div>
                                    {moment(filecreationdatetime).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Date Submitted
                                </div>
                                <div>
                                    {moment(filesubmissiondatetime).format('MM-DD-YYYY')}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Time Submitted
                                </div>
                                <div>
                                    {moment(filesubmissiondatetime).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Effective Entry Date
                                </div>
                                <div>
                                    {effectiveentrydate && moment(effectiveentrydate).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Settlement Date
                                </div>
                                <div>
                                    {settlementdate && moment(settlementdate).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Status
                                </div>
                                <div>
                                    {status}
                                </div>
                            </div>
                            <div className='batch-detail-top-column'>
                                <div>
                                    Amount
                                </div>
                                <div>
                                    ${amount}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        batchDetailsTableHeader && batchDetailsTableRows
                            ? <ReactTable tableHeader={batchDetailsTableHeader} rowData={batchDetailsTableRows}
                                          className='batch-detail-panel'/>
                            : null
                    }
                    <Modal show={showPopup} centered={true}>
                        <Modal.Header>
                            <h5> Account Information </h5>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal-unmasked-detail'>
                                Routing Number: {selectedBatch && selectedBatch.routingnumber}
                            </div>
                            <div className='modal-unmasked-detail'>
                                Account Number: {selectedBatch && selectedBatch.accountnumber}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.onModalClose(e)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        }
        return(
            <div className='batch-detail-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>
        )
    }

    render() {
        let renderObj;

        if(checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderBatchDetails();
        } else {
            renderObj =
                <h3 class='unauthorized-header'>You do not have permission to view this page! Please contact your System
                    Administrator!</h3>
        }

        return (
            renderObj
        );
    }

}

export default ACHActivityBatchDetail;
