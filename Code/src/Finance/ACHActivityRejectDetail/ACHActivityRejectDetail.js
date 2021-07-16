import React from "react";
import {inject, observer} from "mobx-react";
import {Button, Modal} from "react-bootstrap";
import moment from "moment";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import {toJS} from "mobx";
import {checkRenderPermissions} from "../../helpers";
import {permissions, timeOfDayFormat} from "../../constants";
import ReactTable from "../../PaginatedTable/ReactTable";

import './ACHActivityRejectDetail.css';

@inject('claimStore', 'playerStore')
@observer
class ACHActivityRejectDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            selectedRejectFile: null,
        }
    }

    componentDidMount() {
        if(checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            this.props.claimStore.fetchRejectFileDetails();
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
        this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.SHOW_REJECT_FILE_PII, 'Transaction ID: '+target, 'Player Name: '+playerName);
        this.setState({showPopup: true, selectedRejectFile: row});
    }

    onModalClose = () => {
        this.setState({showPopup: false, selectedRejectFile: null});
    }

    renderrejectFileDetails() {
        const {rejectFileDetails, selectedRejectReferenceNumber} = this.props.claimStore;
        const {showPopup, selectedRejectFile} = this.state;
        if(rejectFileDetails && selectedRejectReferenceNumber && rejectFileDetails.selectedRejectFileDetails) {

            const data = toJS(this.props.claimStore.rejectFileDetails)
            const {selectedRejectFileDetails, rejectFileTableHeader, rejectFileTableRows} = data;
            const {processtimestamp, recievetimestamp, totalnumberofrecords, amount} = selectedRejectFileDetails;
            if(checkRenderPermissions(permissions.CAN_SEE_REJECT_MASKED_DETAIL, JSON.parse(localStorage.getItem('userpolicies')))) {
                rejectFileTableHeader.push({key: 'view', label: ''});
                rejectFileTableRows.forEach((row, index) => {
                    row.view = <a key={index} className='reject-detail-link' onClick={() => this.handleViewDetailClick(row)}>
                        Show Details
                    </a>;
                });
            }
            return(
                <div className='reject-detail-container container-fluid'>
                    <div className='reject-detail-panel'>
                        <div className='reject-detail-top-row'>
                            <div className='reject-detail-top-column'>
                                <div>
                                    File Created Date #
                                </div>
                                <div>
                                    {moment(recievetimestamp).format('MM-DD-YYYY')}
                                </div>
                            </div>
                            <div className='reject-detail-top-column'>
                                <div>
                                    File Created Time
                                </div>
                                <div>
                                    {moment(recievetimestamp).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='reject-detail-top-column'>
                                <div>
                                    File Received Date
                                </div>
                                <div>
                                    {moment(processtimestamp).format('MM-DD-YYYY')}
                                </div>
                            </div>
                            <div className='reject-detail-top-column'>
                                <div>
                                    File Received Time
                                </div>
                                <div>
                                    {moment(processtimestamp).format(timeOfDayFormat)}
                                </div>
                            </div>
                            <div className='reject-detail-top-column'>
                                <div>
                                    Number of Records
                                </div>
                                <div>
                                    {totalnumberofrecords}
                                </div>
                            </div>
                            <div className='reject-detail-top-column'>
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
                        rejectFileTableHeader && rejectFileTableRows
                            ? <ReactTable tableHeader={rejectFileTableHeader} rowData={rejectFileTableRows}
                                          className='reject-detail-panel'/>
                            : null
                    }
                    <Modal show={showPopup} centered={true}>
                        <Modal.Header>
                            <h5> Account Information </h5>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal-unmasked-detail'>
                                Routing Number: {selectedRejectFile && selectedRejectFile.routingnumber}
                            </div>
                            <div className='modal-unmasked-detail'>
                                Account Number: {selectedRejectFile && selectedRejectFile.accountnumber}
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
            <div className='reject-detail-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>
        )
    }

    render() {
        let renderObj;

        if(checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderrejectFileDetails();
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

export default ACHActivityRejectDetail;
