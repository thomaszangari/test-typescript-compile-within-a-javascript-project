import React from "react";
import {action, observable} from "mobx";
import config from "../config";
import moment from "moment";
import {timeOfDayFormat} from "../constants.js";
export class ClaimStore {

    rootStore = null;
    authStore = null;

    @observable isLoading = false;

    @observable reconDate = null;
    @observable reconTableRows = [];
    @observable reconTableHeader = [];
    @observable ESAValidations = '$0.00';
    @observable mobileClaims = '$0.00';
    @observable playerPayments = '$0.00';
    @observable taxes = '$0.00';
    @observable ACHTotal = '$0.00';
    @observable returnedPayments = '$0.00';
    @observable ACHRetries = '$0.00';
    @observable paperCheckRetries = '$0.00';


    @observable startDate = null;
    @observable endDate = null;
    @observable rejectFileReference = '';
    @observable batchNumber = '';

    @observable tableRows = [];
    @observable tableHeader = [];
    @observable showToast = false;
    @observable successMessage = null;
    @observable errorMessage = null;
    @observable selectedBatchId = null;
    @observable selectedBatchData = null;
    @observable selectedRejectData = null;
    @observable selectedRejectReferenceNumber = null;
    @observable selectedRejectId = null;
    @observable batchDetails = null;
    @observable rejectFileDetails = null;
    @observable rejectedClaimsDetails = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.authStore = this.rootStore.authStore;
    }

    resetToast() {
        this.showToast = false;
        this.errorMessage = null;
        this.successMessage = null;
    }

    setReconData(data) {
        //debugger;
        
        const tableHeader = [
            {key: 'reportType', label: 'Report'},
            {key: 'batchReference', label: 'Batch Ref.'},
            {key: 'recordCount', label: 'Record Count'},
            {key: 'amount', label: 'Total Amount'},
            {key: 'timestamp', label: 'Date'},
        ];

        const lightTableHeader = ['Report', 'Batch Ref.', 'Record Count', 'Total Amount', 'Date'];
        let lightTableData = [];

        let playerPaymentsVal = 0;
        let taxesVal = 0;
        let ACHTotalVal = 0;
        let returnedPaymentsVal = 0;
        let ACHRetriesVal = 0;
        let paperCheckRetriesVal = 0;

        for(let i = 0; i < data.itemizedReports.length; i++){

            let tempItemizedAmount = `$` + `${data.itemizedReports[i].amount}`.padStart(3, '0');
            tempItemizedAmount = [tempItemizedAmount.slice(0, tempItemizedAmount.length - 2), '.', tempItemizedAmount.slice(tempItemizedAmount.length - 2)].join('');

            let formattedTime = moment(data.itemizedReports[i].timestamp).format('MM/DD/YYYY hh:mm:ss a');
            //let tempReport = <a href={'google.com'}>{data.itemizedReports[i].reportType}</a>;
            switch(data.itemizedReports[i].reportType){
                case 'Player Payments by ACH':
                    playerPaymentsVal += data.itemizedReports[i].amount;
                    break;
                case 'Taxes to DOR by ACH':
                    taxesVal += data.itemizedReports[i].amount;
                    break;
                case 'Returned ACH Payments':
                    returnedPaymentsVal += parseInt(data.itemizedReports[i].amount, 10);
                    break;
                case 'Payment Retries by ACH':
                    ACHRetriesVal += data.itemizedReports[i].amount;
                    break;
                case 'Payment Retries by Paper Check':
                    paperCheckRetriesVal += data.itemizedReports[i].amount;
                    break;
            }

            lightTableData.unshift({
                id: `${i + 1}`,
                items: [data.itemizedReports[i].reportType, data.itemizedReports[i].batchReference, `${data.itemizedReports[i].recordCount}`, tempItemizedAmount, formattedTime],
                label: data.itemizedReports[i].reportType,
            });
        }

        ACHTotalVal = playerPaymentsVal + taxesVal;

        /*
        this.reconTableHeader = tableHeader;
        this.reconTableRows = data.itemizedReports;
        */

        this.reconTableHeader = lightTableHeader;
        this.reconTableRows = lightTableData;

        //@observable ESAValidations = '$0.00';
        //@observable mobileClaims = '$0.00';

        //pad the amount values with 0's if it's under 3 characters, then add the '.' character and '$' character for the currency string
        let tempESA = `$` + `${data.ESAValidation}`.padStart(3, '0');
        this.ESAValidations = [tempESA.slice(0, tempESA.length - 2), '.', tempESA.slice(tempESA.length - 2)].join('');

        let tempMobile = `$` + `${data.RTCMobileClaims}`.padStart(3, '0');
        this.mobileClaims = [tempMobile.slice(0, tempMobile.length - 2), '.', tempMobile.slice(tempMobile.length - 2)].join('');

        let tempPlayerPayments = `$` + `${playerPaymentsVal}`.padStart(3, '0');
        this.playerPayments = [tempPlayerPayments.slice(0, tempPlayerPayments.length - 2), '.', tempPlayerPayments.slice(tempPlayerPayments.length - 2)].join('');

        let tempTaxes = `$` + `${taxesVal}`.padStart(3, '0');
        this.taxes = [tempTaxes.slice(0, tempTaxes.length - 2), '.', tempTaxes.slice(tempTaxes.length - 2)].join('');

        let tempACHTotal = `$` + `${ACHTotalVal}`.padStart(3, '0');
        this.ACHTotal = [tempACHTotal.slice(0, tempACHTotal.length - 2), '.', tempACHTotal.slice(tempACHTotal.length - 2)].join('');

        let tempReturnedPayments = `$` + `${returnedPaymentsVal}`.padStart(3, '0');
        this.returnedPayments = [tempReturnedPayments.slice(0, tempReturnedPayments.length - 2), '.', tempReturnedPayments.slice(tempReturnedPayments.length - 2)].join('');
 
        let tempACHRetries = `$` + `${ACHRetriesVal}`.padStart(3, '0');
        this.ACHRetries = [tempACHRetries.slice(0, tempACHRetries.length - 2), '.', tempACHRetries.slice(tempACHRetries.length - 2)].join('');

        let tempPaperCheckRetries = `$` + `${paperCheckRetriesVal}`.padStart(3, '0');
        this.paperCheckRetries = [tempPaperCheckRetries.slice(0, tempPaperCheckRetries.length - 2), '.', tempPaperCheckRetries.slice(tempPaperCheckRetries.length - 2)].join('');
    }   

    /*
    @observable ACHTotal = '$0.00';
    @observable returnedPayments = '$0.00';
    @observable ACHRetries = '$0.00';
    @observable paperCheckRetries = '$0.00';
    */

    setData(data) {
        const tableHeader = [
            {key: 'startDate', label: 'Date Submitted'},
            {key: 'endDate', label: 'Date Received'},
            {key: 'time', label: 'Time'},
            {key: 'batchnumber', label: 'Batch #'},
            {key: 'rejectreferencenumber', label: 'Reject Ref #'},
            {key: 'totalnumberofrecords', label: 'Number of Records'},
            {key: 'amount', label: 'Amount', type: 'currency', classes: 'currency-column'},
            {key: 'status', label: 'Status'},
            {key: 'sftpresponse', label: 'SFTP Response'},
        ];
        data.forEach(element => {
            let startDate = '';
            let endDate = '';


            if (element.batchnumber) {
                startDate = moment(element.filesubmissiondatetime).format('MM-DD-YYYY');
                element.startDate = startDate;
                element.rejectreferencenumber = '';
            }

            if (element.rejectreferencenumber) {
                endDate = moment(element.processtimestamp).format('MM-DD-YYYY');
                element.endDate = endDate;
                element.batchnumber = '';
            }

            const time = moment(element.batchnumber ? element.filesubmissiondatetime : element.processtimestamp).format(timeOfDayFormat);

            element.time = time;
            element.amount = element.amount ? (element.amount / 100) : 0;
            element.amount = element.amount.toFixed(2);
        });
        this.tableHeader = tableHeader;
        this.tableRows = data;
    }

    @action getAchData(queryParams) {
        this.isLoading = true;


        fetch(`${config.SERVER_BASE_URL}/v1/ach/batch/reports${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    this.showToast = true;
                    this.errorMessage = res.error;
                    this.tableRows = [];
                    this.tableHeader = [];
                } else {
                    if (res && res.hasOwnProperty('data') && res.data.length === 0) {
                        this.showToast = true;
                        this.errorMessage = 'No Files matching the criteria have been found';
                        this.tableRows = [];
                        this.tableHeader = [];
                    } else if (res && res.hasOwnProperty('data') && res.data.length > 0) {
                        this.setData(res.data)
                    }
                }
                this.isLoading = false;
            })
            .catch((error) => {
                this.errorMessage = error.toString();
                this.isLoading = false;
            });
    }

    @action getReconData(queryParams) {
        this.isLoading = true;


        fetch(`${config.SERVER_BASE_URL}/v1/claim/dailyrecon${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    this.showToast = true;
                    this.errorMessage = res.error;
                    this.tableRows = [];
                    this.tableHeader = [];
                } else {
                    if (res && res.hasOwnProperty('itemizedReports') && res.itemizedReports.length === 0) {
                        this.showToast = true;
                        this.errorMessage = 'No Files matching the criteria have been found';
                        this.tableRows = [];
                        this.tableHeader = [];
                        this.setReconData(res);
                    } else if (res && res.hasOwnProperty('itemizedReports') && res.itemizedReports.length > 0) {
                        this.setReconData(res)
                    }
                }
                this.isLoading = false;
            })
            .catch((error) => {
                this.errorMessage = error.toString();
                this.isLoading = false;
            });
    }

    setToast() {
        this.errorMessage = null;
        this.showToast = false;
    }

    setStartEndDate(_startDate = '', _endDate = '') {
        if (_startDate !== '') {
            this.startDate = _startDate;
        }
        if (_endDate !== '') {
            this.endDate = _endDate;
        }
    }

    setReconDate(_reconDate = '') {
        if (_reconDate !== '') {
            this.reconDate = _reconDate;
        }
    }

    setBatchNumber(value) {
        this.batchNumber = value;
    }

    setRejectFileReference(value) {
        this.rejectFileReference = value;
    }

    clearTableData() {
        this.tableRows = [];
        this.tableHeader = [];
        this.batchNumber = '';
        this.rejectFileReference = '';
        this.batchNumber = '';
        this.startDate = null;
        this.endDate = null;
    }

    reconSetSelectedBatchId(data) {
        this.selectedBatchId = data.items[1];
        this.selectedBatchData = data;
        this.selectedRejectData = null;
        this.selectedRejectReferenceNumber = null;
    }

    reconSetSelectedRejectReferenceNumber(data) {
        this.selectedRejectReferenceNumber = data.items[1];
        //this.selectedRejectId = data.id;
        this.selectedRejectData = data;
        this.selectedBatchId = null;
        this.selectedBatchData = null;
    }

    setSelectedBatchId(data) {
        this.selectedBatchId = data.batchnumber;
        this.selectedBatchData = data;
        this.selectedRejectData = null;
        this.selectedRejectReferenceNumber = null;
    }

    setSelectedRejectReferenceNumber(data) {
        this.selectedRejectReferenceNumber = data.rejectreferencenumber;
        this.selectedRejectId = data.id;
        this.selectedRejectData = data;
        this.selectedBatchId = null;
        this.selectedBatchData = null;
    }

    setBatchDetails(data) {
        if (data) {

            const batchDetailTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'claimid', label: 'Claim ID'},
                {key: 'transactionid', label: 'Transaction ID'},
                {key: 'netamount', label: 'Net Amount', type: 'currency', classes: 'currency-column'},
                {key: 'maksedroutingnumber', label: 'Routing Number'},
                {key: 'maskedaccountnumber', label: 'Account Number'},
                {key: 'rtcstatus', label: 'Status'},
                {key: 'tracenumber', label: 'Trace Number'},
                {key: 'tracenumber', label: 'Detail Sequence'},
            ];

            data.forEach(element => {

                element.maksedroutingnumber = element.routingnumber ? '**********' : '-';
                element.maskedaccountnumber = element.accountnumber ? '**********' : '-';

                element.date = element.timestamp
                    ? moment(element.timestamp).format('MM-DD-YYYY')
                    : '-';
                element.time = element.timestamp
                    ? moment(element.timestamp).format(timeOfDayFormat)
                    : '-';

                element.fileCreationDate = element.filecreationdatetime
                    ? moment(element.filecreationdatetime).format('MM-DD-YYYY')
                    : '-';
                element.fileCreationTime = element.filecreationdatetime
                    ? moment(element.filecreationdatetime).format(timeOfDayFormat)
                    : '-';

                element.dateSubmitted = element.filesubmissiondatetime
                    ? moment(element.filesubmissiondatetime).format('MM-DD-YYYY')
                    : '-';
                element.submittedTime = element.filesubmissiondatetime
                    ? moment(element.filesubmissiondatetime).format(timeOfDayFormat)
                    : '-';

                element.effectiveEntryDate = element.effectiveentrydate
                    ? moment(element.effectiveentrydate).format('MM-DD-YYYY')
                    : '-';

                element.settlementDate = element.settlementdate
                    ? moment(element.settlementdate).format('MM-DD-YYYY')
                    : '-';

                element.netamount = element.netamount ? Number(element.netamount) / 100 : 0;
                element.netamount = element.netamount.toFixed(2);
            });

            this.batchDetails = {
                batchDetailsTableHeader: batchDetailTableHeader,
                batchDetailsTableRows: data,
                selectedBatchDetails: this.selectedBatchData
            };

        } else {
            this.batchDetails = {
                batchDetailsTableHeader: [],
                batchDetailsTableRows: [],
                selectedBatchDetails: {}
            };
            this.showToast = true;
        }
    }

    fetchBatchDetails() {
        this.isLoading = true;
        const batchId = this.selectedBatchId;
        if (batchId) {
            this.isLoading = true;
            const url = `${config.SERVER_BASE_URL}/v1/ach/batch/${batchId}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(res => {
                    this.isLoading = false;
                    if (res && res.error) {
                        this.errorMessage = res.error
                        this.showToast = true;
                    } else if (res && res.data) {
                        if (res.data.length > 0) {
                            this.setBatchDetails(res.data);
                        } else {
                            this.errorMessage = 'No Results.';
                            this.showToast = true;
                        }
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.errorMessage = error.toString();
                });
        }

    }

    setRejectFileDetails(data) {
        if (data) {

            const rejectDetailTableHeader = [
                {key: 'date', label: 'Original Submission Date'},
                {key: 'time', label: 'Original Submission Time'},
                {key: 'batchnumber', label: 'Original Batch #'},
                {key: 'claimid', label: 'Claim ID'},
                {key: 'transactionid', label: 'Transaction ID'},
                {key: 'netamount', label: 'Net Amount', type: 'currency', classes: 'currency-column'},
                {key: 'maksedroutingnumber', label: 'Routing Number'},
                {key: 'maskedaccountnumber', label: 'Account Number'},
                {key: 'rtcstatus', label: 'Status'},
                {key: 'tracenumber', label: 'Trace Number'},
                {key: 'tracenumber', label: 'Detail Sequence'},
            ];

            data.forEach(element => {

                element.maksedroutingnumber = element.routingnumber ? '**********' : '-';
                element.maskedaccountnumber = element.accountnumber ? '**********' : '-';

                element.date = element.timestamp
                    ? moment(element.timestamp).format('MM-DD-YYYY')
                    : '-';
                element.time = element.timestamp
                    ? moment(element.timestamp).format(timeOfDayFormat)
                    : '-';

                element.fileCreationDate = element.recievetimestamp
                    ? moment(element.recievetimestamp).format('MM-DD-YYYY')
                    : '-';
                element.fileCreationTime = element.recievetimestamp
                    ? moment(element.recievetimestamp).format(timeOfDayFormat)
                    : '-';

                element.fileReceivedDate = element.processtimestamp
                    ? moment(element.processtimestamp).format('MM-DD-YYYY')
                    : '-';
                element.fileReceivedTime = element.processtimestamp
                    ? moment(element.processtimestamp).format(timeOfDayFormat)
                    : '-';

                element.effectiveEntryDate = element.effectiveentrydate
                    ? moment(element.effectiveentrydate).format('MM-DD-YYYY')
                    : '-';

                element.settlementDate = element.settlementdate
                    ? moment(element.settlementdate).format('MM-DD-YYYY')
                    : '-';

                element.netamount = element.netamount ? Number(element.netamount) / 100 : 0;
                element.netamount = element.netamount.toFixed(2);
            });

            this.rejectFileDetails = {
                rejectFileTableHeader: rejectDetailTableHeader,
                rejectFileTableRows: data,
                selectedRejectFileDetails: this.selectedRejectData
            };

        } else {
            this.rejectFileDetails = {
                rejectFileTableHeader: [],
                rejectFileTableRows: [],
                selectedRejectFileDetails: {}
            };
            this.showToast = true;
        }
    }

    fetchRejectFileDetails() {
        this.isLoading = true;
        if (this.selectedRejectReferenceNumber) {
            this.isLoading = true;
            const url = `${config.SERVER_BASE_URL}/v1/ach/reject/${this.selectedRejectReferenceNumber}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(res => {
                    this.isLoading = false;
                    if (res && res.error) {
                        this.errorMessage = res.error
                        this.showToast = true;
                    } else if (res && res.data) {
                        if (res.data.length > 0) {
                            this.setRejectFileDetails(res.data);
                        } else {
                            this.errorMessage = 'No Results.';
                            this.showToast = true;
                        }
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.errorMessage = error.toString();
                });
        }

    }

    setRejectedClaimData = (tableHeader, data, isClaimCheck) => {
        const tableRows = [];
        if(data && data.length > 0) {
            data.forEach(row => {
                if(row && row.claim && row.transactions) {
                    const {referenceNumber, prizeAmountInCents, playerFirstName, playerLastName, activeFrom} = row.claim;
                    const date = activeFrom
                        ? moment(activeFrom).format('MM-DD-YYYY')
                        : '-';
                    const time = activeFrom
                        ? moment(activeFrom).format(timeOfDayFormat)
                        : '-';
                    const playerName = `${playerFirstName} ${playerLastName}`;
                    const amount = prizeAmountInCents ? (prizeAmountInCents / 100) : 0;
                    if(!isClaimCheck && row.transactions.length === 1) {
                        tableRows.push({
                            date: date,
                            time: time,
                            player: playerName,
                            referenceNumber: referenceNumber,
                            amount: amount
                        })
                    } else if(isClaimCheck && row.transactions.length > 1) {
                        tableRows.push({
                            date: date,
                            time: time,
                            player: playerName,
                            referenceNumber: referenceNumber,
                            amount: amount
                        })
                    }

                }
            })
        }
        this.rejectedClaimsDetails = {tableHeader, tableRows};
    }

    @action fetchRejectClaims(isClaimCheck=false) {
        this.isLoading = true;

        fetch(`${config.SERVER_BASE_URL}/v1/rejectedclaims`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    this.showToast = true;
                    this.errorMessage = res.error;
                } else {
                    const tableHeader = [
                        {key: 'date', label: 'Date'},
                        {key: 'time', label: 'Time'},
                        {key: 'player', label: 'Player'},
                        {key: 'referenceNumber', label: 'Claim Ref #'},
                        {key: 'amount', label: 'Amount', type: 'currency', classes: 'currency-column'}
                    ];
                    if (res && res.hasOwnProperty('rejectedClaims') && res.rejectedClaims.length === 0) {
                        this.showToast = true;
                        this.errorMessage = 'No Rejected Claims';
                        this.setRejectedClaimData(tableHeader, [])
                    } else if (res && res.hasOwnProperty('rejectedClaims') && res.rejectedClaims.length > 0) {
                        this.setRejectedClaimData(tableHeader, res.rejectedClaims, isClaimCheck)
                    }
                }
                this.isLoading = false;
            })
            .catch((error) => {
                this.errorMessage = error.toString();
                this.isLoading = false;
            });
    }

    @action resubmitACHPayment(claimReferenceNumber, accountNumber, routingNumber, accountType) {

        const data = {
            "claimReferenceNumber": claimReferenceNumber,
            "newAchAccount": {
                "achAccountNumber": accountNumber,
                "achRoutingNumber": routingNumber,
                "achAccountType": accountType
            }
        };

        let url = `${config.SERVER_BASE_URL}/v1/ach/payment/resubmit`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showToast = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });

    }
}
