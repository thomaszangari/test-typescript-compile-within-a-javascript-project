import React from "react";
import {inject, observer} from "mobx-react";
import DatePicker from 'react-datepicker';
import {Button, Modal} from "react-bootstrap";
import moment from "moment";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import {toJS} from "mobx";
import {checkRenderPermissions} from "../../helpers";
import {permissions, timeOfDayFormat} from "../../constants";
//import Tile from "../../components/tile/tile.js";
import LightTable from "../../components/lighttable/LightTable";

import './DailyReconciliationReport.css';

@inject('claimStore', 'playerStore')
@observer
class DailyReconciliationReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            selectedRejectFile: null,
        }
    }

    maxDate() {
        let d = new Date();
        return d.setDate(d.getDate() -1);
    }

    setReconDate = (newDate) => {
        if(newDate === null) {
            this.props.claimStore.setReconDate(null);
            // this.setState({endDate: null, startDate: null});
        } else {
            this.props.claimStore.setReconDate(newDate);
        }
    }

    onSearchClick = () => {
        const {reconDate} = this.props.claimStore;
        let queryParams = '?';
        if (reconDate) {
            const rDate = moment(reconDate).format('YYYY-MM-DD');
            queryParams += `queryDate=${rDate}`;
        }
        this.props.claimStore.getReconData(queryParams);

    }

    componentDidMount() {
        this.props.claimStore.getReconData();
    }

    handlePaymentDetailClick = (paymentData) => {
        this.props.claimStore.logAction(UserActionCategory.API_CALL, UserAction.VIEW_PAYMENT_DETAILS, 'Transaction ID: '+paymentData.transactionId, '');
        this.props.claimStore.setPaymentDetails(paymentData, this.navigateToPaymentDetails);
    }

    onModalClose = () => {
        this.setState({showPopup: false, selectedRejectFile: null});
    }

    viewDetailsClick = (data) => {
        if(data.label == 'Player Payments by ACH' || data.label == 'Taxes to DOR by ACH' || data.label == 'Payment Retries by ACH') {
            this.props.claimStore.reconSetSelectedBatchId(data);
            this.props.history.push('/finance/claims/batch/details');
        } else if (data.label == 'Returned ACH Payments') {
            this.props.claimStore.reconSetSelectedRejectReferenceNumber(data);
            this.props.history.push('/finance/claims/reject/details');
        }

    }

    renderDailyReconciliationReport() {
        const {reconDate, ESAValidations, mobileClaims, playerPayments, taxes, ACHTotal, returnedPayments, ACHRetries, paperCheckRetries, reconTableHeader, reconTableRows} = this.props.claimStore;
        const {} = this.state;
        const rows = toJS(JSON.parse(JSON.stringify(reconTableRows)));
        if(rows.length > 0 &&
            checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            rows.forEach(row => {
                if(row.label != 'Payment Retries by Paper Check' && row.label != 'Unknown Type'){
                    row.items[0] = <a onClick={() => this.viewDetailsClick(row)} className='recon-link'>{row.label}</a>
                }
            })
        }
        if(true) {
            return(
                <div className='full-container'>
                    <div>
                        <div className = 'report-header'>      
                            <div className='tile-card'>
                                <div className='tile-card-title-label'>Mobile Claims Reconciliation Report</div>  
                                <div className = 'tile-card-note-label'>Date</div> 
                                <div className='tile-card-contents'>
                                    <DatePicker
                                    style="margin-right:15px;"
                                    selected={reconDate}
                                    isClearable
                                    maxDate={this.maxDate()}
                                    onChange={date => this.setReconDate(date)}
                                    />
                                    
                                <button className="date-picker-btn" onClick={() => this.onSearchClick()}>Generate</button> 
                                </div> 
                            </div>
                        </div>
                        <div className='container-left'>
                            <div className = 'new-claims'>
                                <div className='tile-card'>
                                    <div className='tile-card-label'>New Claims</div>
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>ESA Validations</div>
                                        <div className='tile-card-data-value'>{ESAValidations}</div>
                                    </div>  
                                    <div className = 'tile-card-note-label'>Imported Data from Third Party</div> 
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>RTC Mobile Claims</div>
                                        <div className='tile-card-data-value'>{mobileClaims}</div>
                                    </div>       
                                </div>
                            </div>
                            <div className = 'new-payments'>
                                <div className='tile-card'>
                                    <div className='tile-card-label'>New Payments</div> <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Player Payment by ACH</div>
                                        <div className='tile-card-data-value'>{playerPayments}</div>
                                    </div>  
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Taxes to DOR by ACH</div>
                                        <div className='tile-card-data-value'>{taxes}</div>
                                    </div>  
                                    <hr></hr>
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Total</div>
                                        <div className='tile-card-data-value'>{ACHTotal}</div>
                                    </div>                
                                </div>
                            </div>
                        </div>
                        <div className='container-right'>
                            <div className = 'returned-payments'>
                                <div className='tile-card'>
                                    <div className='tile-card-label'>Returned Payments</div>     
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Returned ACH Payments</div>
                                        <div className='tile-card-data-value'>{returnedPayments}</div>
                                    </div> 
                                </div>
                            </div>
                            <div className = 'payment-retries'>
                                <div className='tile-card'>
                                    <div className='tile-card-label'>Payment Retries</div>  
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Payment Retries by ACH</div>
                                        <div className='tile-card-data-value'>{ACHRetries}</div>
                                    </div>  
                                    <div className='tile-card-data'>
                                        <div className='tile-card-data-label'>Payment Retries by Paper Check</div>
                                        <div className='tile-card-data-value'>{paperCheckRetries}</div>
                                    </div>       
                                </div>
                            </div>
                        </div>                                     
                    </div>
                    <div className='itemized-transactions'>
                        {
                            reconTableHeader && reconTableHeader.length > 0 ?
                            <div className='tile-card'>
                                <div className='tile-card-label'>Itemized Transaction Reports</div>
                                <div className='table-container'>
                                    <LightTable theadData={reconTableHeader} tbodyData={rows}/>  
                                </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            )
        }
    }

    render() {
        //<NewTable tableHeader={reconTableHeader} rowData={reconTableRows}></NewTable>
        let renderObj;

        if(checkRenderPermissions(permissions.CAN_SEE_DAILY_RECONCILIATION, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderDailyReconciliationReport();
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

export default DailyReconciliationReport;
