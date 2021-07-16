import React from "react";
import {action, observable} from 'mobx';
import config from "../config";
import {UserAction, UserActionCategory} from "../UserActionCategory";
import moment from "moment";
import {toJS} from "mobx";
import {timeOfDayFormat} from "../constants.js";


export class PlayerStore {

    rootStore = null;
    authStore = null;

    @observable isLoading = false;
    @observable showToast = false;
    @observable selectedPlayerDetails = null;
    @observable selectedPlayerID = null;
    @observable tableHeader = null;
    @observable tableRows = null;
    @observable ticketHistoryTableHeader = null;
    @observable ticketHistoryTableRows = null;
    @observable eventHistoryTableHeader = null;
    @observable eventHistoryTableRows = null;
    @observable errorMessage = null;
    @observable successMessage = null;
    @observable titleText = null;
    @observable showUpdateModal = false;
    @observable showConfirmEmailModal = false;
    @observable showPlayerVerifyModal = false;
    @observable showPlayerLockUnlockModal = false;
    @observable showPlayerEnableDisableModal = false;
    @observable showFrequentCasherConfirmModal = false;

    // Back-office user audit
    @observable selectedBackofficeUserID = null;
    @observable selectedBackofficeUserFullName = null;
    @observable selectedBackofficeUserName = null;
    @observable AuditActionsTableHeader = null;
    @observable AuditActionsTableRows = null;
    @observable UserNameTitleText = null;

    //
    @observable loggedInUserID = null;

    @observable showTicketHistoryToast = false;
    @observable TicketHistoryAPIResult = null;
    @observable TicketHistoryFilteredResult = null;
    @observable selectedGameType = null;
    @observable allGameTypes = [];
    @observable selectedWinStatus = null;
    @observable allWinStatuses = [];
    @observable selectedStatus = null;
    @observable allStatuses = [];
    @observable isTicketHistoryInSearchMode = false;
    @observable showEventHistoryToast = false;
    @observable isEventHistoryInSearchMode = false;

    @observable EventHistoryAPIResult = null;
    @observable EventHistoryFilteredResult = null;
    @observable selectedDeviceType = null;
    @observable allDeviceTypes = [];
    @observable selectedEvent = null;
    @observable allEvents = [];

    // Auth Layout
    @observable showMainToast = false;
    @observable mainErrorMessage = '';
    @observable mainSuccessMessage = '';

    // Player Hub
    @observable playerHubNavigateToFirstTab = false;

    // Claims
    @observable claimHistoryTableHeader = null;
    @observable claimHistoryTableRows = null;
    @observable selectedClaimId = null;
    @observable selectedClaimStatus = null;
    @observable claimDetails = null;
    @observable paymentHistoryData = null;
    @observable paymentDetails = null;
    @observable eSignatureURL = null;

    @observable selectedTabKey = 'Player Details';

    //  Spinner State
    @observable isSpinnerLoading = false;

    @observable toggle = false;

    setToggle(toggle) {
        this.toggle = toggle;        
    }

    @action setToastErrorSuccessMessage(showToast, errorMessage, successMessage) {
        this.showMainToast = showToast;
        this.mainErrorMessage = errorMessage;
        this.mainSuccessMessage = successMessage;
    }

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.authStore = this.rootStore.authStore;
    }

    @action clear() {
        this.isLoading = false;
    }

    clearPlayerSearchResults() {
        this.tableHeader = null;
        this.tableRows = null;
    }

    clearTicketHistorySearchResults() {
        this.selectedGameType = 'All';
        this.selectedWinStatus = 'All';
        this.selectedStatus = 'All';
        this.ticketHistoryTableHeader = null;
        this.ticketHistoryTableRows = null;
    }

    clearEventHistorySearchResults() {
        this.selectedDeviceType = 'All';
        this.selectedEvent = 'All';
        this.eventHistoryTableHeader = null;
        this.eventHistoryTableRows = null;
    }

    clearUserAuditActionSearchResults() {
        this.AuditActionsTableHeader = null;
        this.AuditActionsTableRows = null;
    }

    updateUserDetails(value, param) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity, account} = _selectedPlayerDetails;
        identity[param] = value;
        this.selectedPlayerDetails = _selectedPlayerDetails;
    }

    updateUserEmail(value, param) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {account} = _selectedPlayerDetails;
        account[param] = value;
        this.selectedPlayerDetails = _selectedPlayerDetails;
    }

    updatePlayerDateOfBirth(newDateOfBirth) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        identity['dateOfBirth'] = newDateOfBirth;
        this.selectedPlayerDetails = _selectedPlayerDetails;
    }

    // API call to fetch player details
    @action getPlayerDetails(playerId='') {
        const id = playerId || this.selectedPlayerID;
        this.isSpinnerLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/player/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                this.isSpinnerLoading = false;
                if(playerId) {
                    if (res && res.message) {
                        this.setToastErrorSuccessMessage(true, res.message, null);
                    } else {
                        const row = res.identity || {};
                        if(!res.identity) {
                            row.firstName = '';
                            row.lastName = '';
                            row.address = '';
                        }
                        row.playerId = res.account && res.account.id ? res.account.id: '';
                        row.email = res.account && res.account.email ? res.account.email : '';
                        this.tableHeader = [
                            {key: 'email', label: 'Email'},
                            {key: 'firstName', label: 'First Name'},
                            {key: 'lastName', label: 'Last Name'},
                            {key: 'address', label: 'Address', width: '30%'},
                            {key: 'select', label: 'Select'}
                        ];
                        this.tableRows = [row];
                    }
                } else {
                    if (res && res.error) {
                        this.errorMessage = res.error;
                    } else {
                        if(!res.hasOwnProperty('identity') || !res.identity) {
                           res.identity = {
                               "id": '',
                               "playerId": res.account && res.account.id ? res.account.id: '',
                               "identityFingerprint": "",
                               "firstName": "",
                               "lastName": "",
                               "gender": "",
                               "ssn": "",
                               "dateOfBirth": "",
                               "address1": "",
                               "address2": "",
                               "city": "",
                               "state": "",
                               "zip5": "",
                               "phone": "",
                               "acceptedEmailCommunication": false,
                               "acceptedSmsCommunication": false,
                               "termsAcceptedDate": "",
                               "activeFrom": "",
                               "activeTo": null,
                               "identityCheckResult": "",
                               "identityCheckSource": "",
                               "identityCheckNotes": "",
                               "identitySource": "",
                               "identityCheckRequestId": "",
                               "identityServiceTermsAcceptedDate": "",
                               "status": ""
                           }
                        }
                        res.identity.phone = res.identity.phone.substring(2);
                        res.identity.dateOfBirth = res.identity.dateOfBirth ? moment(res.identity.dateOfBirth).format('MM/DD/YYYY') : '';
                        this.selectedPlayerDetails = res;
                    }
                }

            })
            .catch((error) => {
                this.isSpinnerLoading = false;
                this.errorMessage = error.toString();
            });
    }

    @action searchPlayers(queryParams) {
        this.isLoading = true;
        this.isSpinnerLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/player/search${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.data) {
                    this.setPlayerData(res.data);
                    const errorMessage = res.data.length <= 0 ? 'No Results Matching Criteria Have Been Found' : null;
                    const showToast = res.data.length <= 0 ? true : false;
                    this.setToastErrorSuccessMessage(showToast, null, errorMessage)
                } else if (res && res.error) {
                    this.setPlayerData(res.data);
                    const errorMessage = res.error;
                    const showToast = true;
                    this.setToastErrorSuccessMessage(showToast, errorMessage, null)
                }
                this.isSpinnerLoading = false;
            })
            .catch((error) => {
                this.errorMessage = error.toString();
                this.isSpinnerLoading = false;
                // this.setState({errorMessage: error.toString()});
            });
    }

    setTicketHistorySearchMode(flag) {
        this.isTicketHistoryInSearchMode = flag;
    }

    // API call to fetch tickets associated with a player
    @action searchTickets(queryParams) {
        const id = this.selectedPlayerID;
        this.isLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/player/${id}/ticket-scanner-events${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    //this.showResetPasswordModal = false;
                    //this.showTicketHistoryToast = true;
                    this.showToast = true;
                } else if (res && res.data) {
                    if (res.data.length > 0) {
                        this.setTicketHistoryData(res.data);
                        this.setTicketHistorySearchMode(false)
                        let allGameTypes = this.getAllGameTypesFromTicketHistoryResult();
                        let allWinStatuses = this.getAllWinStatusesFromTicketHistoryResult();
                        let allStatuses = this.getAllStatusesFromTicketHistoryResult();
                        this.setTicketHistoryFilters(allGameTypes, allWinStatuses, allStatuses)
                    } else {
                        this.setTicketHistorySearchMode(true)
                        this.successMessage = 'No Results Matching the Criteria have been Found.';
                        this.errorMessage = null;
                        //this.showResetPasswordModal = false;
                        //this.showTicketHistoryToast = true;
                        this.showToast = true;
                    }
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    setEventHistorySearchMode(flag) {
        this.isEventHistoryInSearchMode = flag;
    }

    @action searchEvents(queryParams) {
        const id = this.selectedPlayerID;
        this.isLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/player/${id}/player-events${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    //this.showResetPasswordModal = false;
                    //this.showEventHistoryToast = true;
                    this.showToast = true;
                } else if (res && res.data) {
                    if (res.data.length > 0) {
                        this.setEventHistoryData(res.data);
                        this.setEventHistorySearchMode(false)
                        let allDeviceTypes = this.getAllDeviceTypesFromEventHistoryResult();
                        let allEvents = this.getAllEventTypesFromEventHistoryResult();
                        this.setEventHistoryFilters(allDeviceTypes, allEvents)
                    } else {
                        this.setEventHistorySearchMode(true)
                        this.successMessage = 'No Results Matching the Criteria have been Found.';
                        this.errorMessage = null;
                        //this.showResetPasswordModal = false;
                        //this.showEventHistoryToast = true;
                        this.showToast = true;
                    }
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action searchUserAuditActions(queryParams) {
        const id = this.selectedBackofficeUserID;
        this.isLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/user/${id}/auditactions${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {

                if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    //this.showResetPasswordModal = false;
                    this.showToast = true;
                } else if (res) {
                    if (res.length > 0) {
                        this.setUserAuditActionsData(res);
                    } else {
                        this.successMessage = 'No Results Matching the Criteria have been Found.';
                        this.errorMessage = null;
                        //this.showResetPasswordModal = false;
                        this.showToast = true;
                    }
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action updatePlayer(isFlag = false) {

        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity, account} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        this.isLoading = true;
        const playerData = {
            firstName: identity.hasOwnProperty('firstName') && identity['firstName'] ? identity['firstName'].trim() : '',
            lastName: identity.hasOwnProperty('lastName') && identity['lastName'] ? identity['lastName'].trim() : '',
            email: account.hasOwnProperty('email') && account['email'] ? account['email'].trim() : '',
            address1: identity.hasOwnProperty('address1') && identity['address1'] ? identity['address1'].trim() : '',
            address2: identity.hasOwnProperty('address2') && identity['address2'] ? identity['address2'].trim() : '',
            city: identity.hasOwnProperty('city') && identity['city'] ? identity['city'].trim() : '',
            state: identity.hasOwnProperty('state') && identity['state'] ? identity['state'] : '',
            zip5: identity.hasOwnProperty('zip5') && identity['zip5'] ? identity['zip5'].trim() : '',
            phone: identity.hasOwnProperty('phone') && identity['phone'] ? identity['phone'].trim() : '',
            gender: identity.hasOwnProperty('gender') && identity['gender'] ? identity['gender'] : '',
            dateOfBirth: identity.hasOwnProperty('dateOfBirth') && identity['dateOfBirth'] ? identity['dateOfBirth'] : '',
            ssn: identity.hasOwnProperty('ssn') && identity['ssn'] ? identity['ssn'].trim() : ''
        }

        // Do not update SSN if its just last 4 digits that originally came from API response
        if (identity.hasOwnProperty('ssn') && identity['ssn'] && identity['ssn'].trim().startsWith("***-**")) {
            delete playerData.ssn;
        }

        fetch(`${config.SERVER_BASE_URL}/v1/player/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData),
        })
            .then(response => response.json())
            .then(res => {

                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showUpdateModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showUpdateModal = false;
                    this.showToast = true;
                }

            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action updateSSNAndVerifyPlayer(identification1, identification2, comment1, comment2) {


        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity, account} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        this.isLoading = true;
        const playerData = {
            ssn: identity['ssn'].trim()
        }

        // Do not update SSN if its just last 4 digits that originally came from API response
        if (identity['ssn'].trim().startsWith("***-**")) {
            delete playerData.ssn;
        }

        fetch(`${config.SERVER_BASE_URL}/v1/player/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData),
        })
            .then(response => response.json())
            .then(res => {

                if (res && res.message) {
                    //this.successMessage = res.message;
                    //this.errorMessage = null;
                    //this.showUpdateModal = false;
                    //this.showToast = true;
                    //this.playerHubNavigateToFirstTab = true;
                    this.verifyPlayer(identification1, identification2, comment1, comment2);
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showUpdateModal = false;
                    this.showToast = true;
                }

            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    setPlayerData(data) {
        if (data) {
            const rows = Object.values(data).map(d => d);
            this.tableHeader = [
                {key: 'email', label: 'Email'},
                {key: 'firstName', label: 'First Name'},
                {key: 'lastName', label: 'Last Name'},
                {key: 'address', label: 'Address', width: '30%'},
                {key: 'select', label: 'Select'}
            ];
            this.tableRows = rows;
        } else {
            this.tableHeader = [];
            this.tableRows = [];
            this.showToast = true;
        }
    }

    setTicketHistoryData(data) {
        if (data) {
            this.TicketHistoryAPIResult = data;
            const rows = Object.values(data).map(d => d);
            this.ticketHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'gameType', label: 'Game'},
                {key: 'winStatus', label: 'Win Status'},
                {key: 'amount', label: 'Amount'},
                {key: 'status', label: 'Approval Status'},
                {key: 'computedStatus', label: 'Ticket Status'},
                {key: 'rejectReason', label: 'Reason', width: '12%'},
                {key: 'barcode', label: 'Barcode'}
            ];
            rows.forEach(element => element.requestTimestamp = moment(element.requestTimestamp).format());
            this.ticketHistoryTableRows = rows;
        } else {
            this.ticketHistoryTableHeader = [];
            this.ticketHistoryTableRows = [];
            this.showToast = true;
        }
    }

    setTicketHistoryFilteredData(data) {
        if (data) {
            this.TicketHistoryFilteredResult = data;
            const rows = Object.values(data).map(d => d);
            this.ticketHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'gameType', label: 'Game'},
                {key: 'winStatus', label: 'Win Status'},
                {key: 'amount', label: 'Amount'},
                {key: 'status', label: 'Approval Status'},
                {key: 'computedStatus', label: 'Ticket Status'},
                {key: 'rejectReason', label: 'Reason'},
                {key: 'barcode', label: 'Barcode'}
            ];
            this.ticketHistoryTableRows = rows;
        } else {
            this.ticketHistoryTableHeader = [];
            this.ticketHistoryTableRows = [];
            this.showToast = true;
        }
    }

    setTicketHistoryFilters(allGameTypes, allWinStatuses, allStatuses) {
        this.allGameTypes = allGameTypes;
        this.allWinStatuses = allWinStatuses;
        this.allStatuses = allStatuses;
    }

    setEventHistoryData(data) {
        if (data) {
            this.EventHistoryAPIResult = data;
            const rows = Object.values(data).map(d => d);
            this.eventHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'clientOs', label: 'Device Type'},
                {key: 'authEvent', label: 'Event'}
            ];
            rows.forEach(element => element.eventTimestamp = moment(element.eventTimestamp).format());
            this.eventHistoryTableRows = rows;
        } else {
            this.eventHistoryTableHeader = [];
            this.eventHistoryTableRows = [];
            this.showToast = true;
        }
    }

    setEventHistoryFilteredData(data) {
        if (data) {
            this.EventHistoryFilteredResult = data;
            const rows = Object.values(data).map(d => d);
            this.eventHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'clientOs', label: 'Device Type'},
                {key: 'authEvent', label: 'Event'}
            ];
            this.eventHistoryTableRows = rows;
        } else {
            this.eventHistoryTableHeader = [];
            this.eventHistoryTableRows = [];
            this.showToast = true;
        }
    }

    setEventHistoryFilters(allDeviceTypes, allEvents) {
        this.allDeviceTypes = allDeviceTypes;
        this.allEvents = allEvents;
    }

    setUserAuditActionsData(data) {
        if (data) {
            const rows = Object.values(data).map(d => d);
            this.AuditActionsTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'target', label: 'Target'},
                {key: 'actions', label: 'Action'},
                {key: 'data', label: 'Data'}
            ];
            this.AuditActionsTableRows = rows;
        } else {
            this.AuditActionsTableHeader = [];
            this.AuditActionsTableRows = [];
            this.showToast = true;
        }
    }

    setSelectedPlayerDetails(selectedId) {
        if (this.tableRows && this.tableRows.length) {
            const data = this.tableRows.find(row => row.playerId === selectedId);
            this.selectedPlayerDetails = data;
            this.titleText = `Player: ${data.firstName} ${data.lastName}`;
            this.selectedPlayerID = selectedId;
        }
        this.selectedTabKey = 'Player Details';
    }

    setSelectedBackOfficeUserID(selectedId) {
        this.selectedBackofficeUserID = selectedId;
    }

    setSelectedBackOfficeUserName(selectedUserName) {
        this.selectedBackofficeUserName = selectedUserName;
    }

    setToast(flag) {
        this.showToast = flag;
        this.successMessage = null;
        this.errorMessage = null;
    }

    setEventHistoryToast(flag) {
        this.showEventHistoryToast = flag;
        this.successMessage = null;
        this.errorMessage = null;
    }

    setTicketHistoryToast(flag) {
        this.showTicketHistoryToast = flag;
        this.successMessage = null;
        this.errorMessage = null;
    }

    // API call to reset player password
    @action confirmPlayerEmail() {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const obj = {
            firstName: identity['firstName'], lastName: identity['lastName']
        };
        this.isLoading = true;
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/verify-email`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {

                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showConfirmEmailModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showConfirmEmailModal = false;
                    this.showToast = true;
                }

            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // API calls to enable player account
    @action enablePlayer(reason, comment) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const obj = {
            firstName: identity['firstName'], lastName: identity['lastName'],
            reason: reason, comment: comment
        }
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/enable`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showPlayerLockUnlockModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showPlayerLockUnlockModal = false;
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // API calls to disable player account
    @action disablePlayer(reason, comment) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const obj = {
            firstName: identity['firstName'], lastName: identity['lastName'],
            reason: reason, comment: comment
        }
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/disable`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showPlayerLockUnlockModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showPlayerLockUnlockModal = false;
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // API calls to enable player account
    @action enablePlayerScan(reason, comment) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const obj = {
            firstName: identity['firstName'], lastName: identity['lastName'],
            reason: reason, comment: comment
        }
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/enable-scans`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showPlayerEnableDisableModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showPlayerEnableDisableModal = false;
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // API calls to disable player account
    @action disablePlayerScan(reason, comment) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const obj = {
            firstName: identity['firstName'], lastName: identity['lastName'],
            reason: reason, comment: comment
        }
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/disable-scans`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showPlayerEnableDisableModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showPlayerEnableDisableModal = false;
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // API call to add a person to the Frequent Casher list
    @action AddFrequentCasher(firstName, lastName, ssn) {

        const player = {
            firstName: firstName,
            lastName: lastName,
            ssn: ssn
        }

        let url = `${config.SERVER_BASE_URL}/v1/player/add-frequent-casher`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.showFrequentCasherConfirmModal = false;
                    this.setToastErrorSuccessMessage(true, null, res.message)
                } else if (res && res.error) {
                    this.showFrequentCasherConfirmModal = false;
                    this.setToastErrorSuccessMessage(true, res.error, null)
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });

    }

    // API call to remove a person from the Frequent Casher list
    @action RemoveFrequentCasher(firstName, lastName, ssn) {

        const player = {
            firstName: firstName,
            lastName: lastName,
            ssn: ssn
        }

        let url = `${config.SERVER_BASE_URL}/v1/player/remove-frequent-casher`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.showFrequentCasherConfirmModal = false;
                    this.setToastErrorSuccessMessage(true, null, res.message)
                } else if (res && res.error) {
                    this.showFrequentCasherConfirmModal = false;
                    this.setToastErrorSuccessMessage(true, res.error, null)
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    setShowUpdateModal(flag) {
        this.showUpdateModal = flag
    }

    setShowConfirmEmailModal(flag) {
        this.showConfirmEmailModal = flag
    }

    setShowPlayerVerifyModal(flag) {
        this.showPlayerVerifyModal = flag
    }

    setshowPlayerLockUnlockModal(flag) {
        this.showPlayerLockUnlockModal = flag
    }
    
    setShowPlayerEnableDisableModal(flag) {
        this.showPlayerEnableDisableModal = flag;
    }

    setShowFrequentCasherConfirmModal(flag) {
        this.showFrequentCasherConfirmModal = flag
    }

    // API call to verify player
    @action verifyPlayer(identification1, identification2, comment1, comment2) {
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const id = this.selectedPlayerID;
        const verifyData = {
            firstName: identity['firstName'],
            lastName: identity['lastName'],
            identification1: identification1,
            identification2: identification2,
            comment1: comment1,
            comment2: comment2
        }
        let url = `${config.SERVER_BASE_URL}/v1/player/${id}/verify`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showPlayerVerifyModal = false;
                    this.showToast = true;
                    this.playerHubNavigateToFirstTab = true;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showPlayerVerifyModal = false;
                    this.showToast = true;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action logAction(actionCategory, action, target = '', comments = '') {

        const logline = {
            category: actionCategory,
            action: action,
            target: target,
            comments: comments
        }

        this.isLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/log/action`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logline),
        })
            .then(response => response.json())
            .then(res => {
                if (res) {

                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action getUserInfo(id) {
        this.selectedBackofficeUserID = id;
        this.isLoading = true;
        fetch(`${config.SERVER_BASE_URL}/v1/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res) {
                    const {firstname, lastname} = res;
                    this.UserNameTitleText = `${firstname} ${lastname}`
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    // filterJSONObjectArrayOnCriteria(input.data, {  "gameType": "INSTANT",  "winStatus":"CASHING_LIMIT_EXCEEDED",  "status":"REJECTED"});
    // filterJSONObjectArrayOnCriteria([]);
    // filterJSONObjectArrayOnCriteria(input);
    @action filterJSONObjectArrayOnCriteria(list, criteria = '') {

        if (list == null || list.length === 0)
            return [];

        if (criteria === '')
            return list;

        return list.filter(candidate =>
            Object.keys(criteria).every(key => candidate[key] == criteria[key]
            )
        );
    }

    // getAllValuesForKeyFromJSONObjectArray(input.data)
    @action getAllValuesForKeyFromJSONObjectArray(list, key) {

        let result = new Set();

        result.add('All')

        let obj = ''
        let option = ''
        for (let i = 0; i < list.length; i++) {
            obj = list[i];
            option = obj[key];
            if (option != null && option !== '')
                result.add(option);
        }

        return Array.from(result);
    }

    @action filterTicketHistoryResult() {

        let criteria = {};

        if (this.selectedGameType && this.selectedGameType !== 'All' && this.selectedGameType !== '') {
            criteria['gameType'] = this.selectedGameType;
        }

        if (this.selectedWinStatus && this.selectedWinStatus !== 'All' && this.selectedWinStatus !== '') {
            criteria['winStatus'] = this.selectedWinStatus;
        }

        if (this.selectedStatus && this.selectedStatus !== 'All' && this.selectedStatus !== '') {
            criteria['status'] = this.selectedStatus;
        }

        //alert(JSON.stringify(criteria))

        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const PlayerName = `Player Name: ${identity['firstName']} ${identity['lastName']}`

        this.logAction(UserActionCategory.FILTER_RESULTS, UserAction.TICKET_HISTORY, PlayerName, criteria)

        let data = this.filterJSONObjectArrayOnCriteria(this.TicketHistoryAPIResult, criteria);
        this.setTicketHistoryFilteredData(data)
    }

    @action filterEventHistoryResult() {

        let criteria = {};

        if (this.selectedDeviceType && this.selectedDeviceType !== 'All' && this.selectedDeviceType !== '') {
            criteria['clientOs'] = this.selectedDeviceType;
        }

        if (this.selectedEvent && this.selectedEvent !== 'All' && this.selectedEvent !== '') {
            criteria['authEvent'] = this.selectedEvent;
        }
        //alert(JSON.stringify(criteria))

        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const PlayerName = `Player Name: ${identity['firstName']} ${identity['lastName']}`

        this.logAction(UserActionCategory.FILTER_RESULTS, UserAction.EVENT_HISTORY, PlayerName, criteria)


        let data = this.filterJSONObjectArrayOnCriteria(this.EventHistoryAPIResult, criteria);
        this.setEventHistoryFilteredData(data)
    }

    // Returns all the values for the key - clientOs, from the Event History Results
    @action getAllDeviceTypesFromEventHistoryResult() {
        return this.getAllValuesForKeyFromJSONObjectArray(this.EventHistoryAPIResult, 'clientOs');
    }

    // Returns all the values for the key - AuthEvent, from the Event History Results
    @action getAllEventTypesFromEventHistoryResult() {
        return this.getAllValuesForKeyFromJSONObjectArray(this.EventHistoryAPIResult, 'authEvent');
    }

    // Returns all the values for the key - gameType, from the Ticket History Results
    @action getAllGameTypesFromTicketHistoryResult() {
        return this.getAllValuesForKeyFromJSONObjectArray(this.TicketHistoryAPIResult, 'gameType');
    }

    // Returns all the values for the key - winStatus, from the Ticket History Results
    @action getAllWinStatusesFromTicketHistoryResult() {
        return this.getAllValuesForKeyFromJSONObjectArray(this.TicketHistoryAPIResult, 'winStatus');
    }

    // Returns all the values for the key - status, from the Ticket History Results
    @action getAllStatusesFromTicketHistoryResult() {
        return this.getAllValuesForKeyFromJSONObjectArray(this.TicketHistoryAPIResult, 'status');
    }

    @action ClearTicketHistoryFilters() {
        this.selectedGameType = 'All';
        this.selectedWinStatus = 'All';
        this.selectedStatus = 'All';
        this.filterTicketHistoryResult();
    }

    @action ClearEventHistoryFilters() {
        this.selectedDeviceType = 'All';
        this.selectedEvent = 'All';
        this.filterEventHistoryResult();
    }

    @action setSelectedGameType(val) {
        this.selectedGameType = val;
    }

    @action setSelectedWinStatus(val) {
        this.selectedWinStatus = val;
    }

    @action setSelectedStatus(val) {
        this.selectedStatus = val;
    }

    @action setSelectedDeviceType(val) {
        this.selectedDeviceType = val;
    }

    @action setSelectedEvent(val) {
        this.selectedEvent = val;
    }

    showFileNewTab(data, isSkip = false) {
        if (data === undefined || isSkip) return
        let file = new Blob([data], {type: 'application/pdf'});
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    @action downloadPDF(filename) {
        let url = `${config.SERVER_BASE_URL}/v1/download/${filename}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json application/pdf',
            },
        })
            .then(response => {
                if (!response.ok) {
                    this.setToastErrorSuccessMessage(true, 'No Document Found.', null)
                    return
                }
                return response.blob();
            })
            .then(this.showFileNewTab)
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    setClaimHistoryData(data) {
        if (data) {
            const rows = Object.values(data).map(d => d.claim);

            this.claimHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'referenceNumber', label: 'Claim ID'},
                {key: 'status', label: 'Status'},
            ];

            rows.forEach(element => {
                const date = moment(element.activeFrom).format('MM-DD-YYYY');
                const time = moment(element.activeFrom).format(timeOfDayFormat);
                element.date = date;
                element.time = time;
                // element.requestTimestamp = moment(element.requestTimestamp).format()
            });
            this.claimHistoryTableRows = rows;
        } else {
            this.claimHistoryTableHeader = [];
            this.claimHistoryTableRows = [];
            this.showToast = true;
            this.successMessage = 'Player has no Claims';
            this.errorMessage = null;
        }
    }

    // API call to fetch tickets associated with a player
    @action fetchAllClaims() {
        const id = this.selectedPlayerID;
        this.isLoading = true;
        const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
        const {identity} = _selectedPlayerDetails;
        const obj = {
            firstName: identity['firstName'],
            lastName: identity['lastName'],
            playerId: identity['id'],
            reason: 'reason',
            comment: 'comment'
        }
        const url = `${config.SERVER_BASE_URL}/v1/player/${id}/claims`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showToast = true;
                } else if (res && res.claims) {
                    if (res.claims.length > 0) {
                        this.setClaimHistoryData(res.claims);
                    } else {
                        this.claimHistoryTableHeader = [];
                        this.claimHistoryTableRows = [];
                        this.showToast = true;
                        this.successMessage = 'Player has no Claims';
                        this.errorMessage = null;
                    }
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
                this.showToast = true;
                this.successMessage = null;
            });
    }

    setSelectedClaim(claim, cb, flag=false) {
        if(flag) {
            this.selectedPlayerDetails = {
                identity: {
                    firstName: claim.playerFirstName,
                    lastName: claim.playerLastName
                }
            }
        }
        this.selectedClaimId = claim.referenceNumber;
        this.selectedClaimStatus = claim.status;
        cb();
    }

    setClaimDetails(data, count) {
        if (data && data.currState) {
            const rowData = data.prevStates || [];

            const claimHistoryTableHeader = [
                {key: 'date', label: 'Date'},
                {key: 'time', label: 'Time'},
                {key: 'status', label: 'Status'},
                {key: 'prizeAmountInCents', label: 'Amount', type: 'currency', classes: 'currency-column'},
            ];

            rowData.forEach(element => {
                const date = moment(element.activeFrom).format('MM-DD-YYYY');
                const time = moment(element.activeFrom).format(timeOfDayFormat);

                element.date = date;
                element.time = time;

                element.prizeAmountInCents = element.prizeAmountInCents ? (element.prizeAmountInCents / 100).toFixed(2) : 0;
            });


            const selectedClaimDetails = data.currState || null;

            this.eSignatureURL = data.eSignatureUrl || null;

            selectedClaimDetails.rejectedCount = count;

            const stateTax = data.lineItems ? data.lineItems.find(item => item.type === 'TAX_STATE') : null;
            selectedClaimDetails.taxWithholding = stateTax && stateTax.amountInCents ? (stateTax.amountInCents / 100).toFixed(2) : 0;

            if (selectedClaimDetails.taxWithholding < 0) {
                selectedClaimDetails.taxWithholding *= -1;
            }
            const offsetTax = data.lineItems ? data.lineItems.find(item => item.type === 'OFFSET') : null;
            selectedClaimDetails.offsetWithholding = offsetTax && offsetTax.amountInCents ? (offsetTax.amountInCents / 100).toFixed(2) : 0;

            if (selectedClaimDetails.offsetWithholding < 0) {
                selectedClaimDetails.offsetWithholding *= -1;
            }

            selectedClaimDetails.netPaymentAmountInCents = (data.netPaymentAmountInCents).toFixed(2) || 0;
            this.claimDetails = {
                claimHistoryTableHeader,
                claimHistoryTableRows: rowData,
                selectedClaimDetails: selectedClaimDetails
            };

        } else {
            this.claimDetails = {
                claimHistoryTableHeader: [],
                claimHistoryTableRows: []
            };
            this.showToast = true;
        }
    }

    // API call to fetch claim details
    @action fetchClaimDetails() {
        const claimReferenceNumber = this.selectedClaimId;
        if (this.selectedClaimId) {
            this.isLoading = true;
            const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
            const {identity} = _selectedPlayerDetails;
            const obj = {
                firstName: identity['firstName'],
                lastName: identity['lastName'],
                reason: 'reason',
                comment: 'comment'
            }
            const url = `${config.SERVER_BASE_URL}/v1/claim/${claimReferenceNumber}/details`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            })
                .then(response => response.json())
                .then(res => {
                    if (res && res.error) {
                        this.successMessage = null;
                        this.errorMessage = res.error
                        this.showToast = true;
                    } else if (res && res.claim) {
                        if (res.claim.prevStates) {
                            let count = 0;
                            if (res.hasOwnProperty('rejectCount')) {
                                count = res.rejectCount;
                            }
                            this.setClaimDetails(res.claim, count);
                        } else {
                            this.successMessage = 'No Results.';
                            this.errorMessage = null;
                            this.showToast = true;
                        }
                    }
                })
                .catch((error) => {
                    this.errorMessage = error.toString();
                });
        }
    }

    setPaymentHistoryData(data) {
        const rows = data.map(item => {
            if (item.details) {
                const {createdAt, amountInCents} = item.details;
                const date = moment(createdAt).format('MM-DD-YYYY');
                const time = moment(createdAt).format(timeOfDayFormat);
                item.date = date;
                item.time = time;
                item.amount = amountInCents ? (amountInCents / 100) : 0;
                item.amount = item.amount.toFixed(2);
            }
            return item;
        })
        this.paymentHistoryData = rows || [];
    }

    // API call to fetch claim payment history data
    @action fetchPaymentHistoryDetails() {
        const claimReferenceNumber = this.selectedClaimId;
        if (this.selectedClaimId) {
            this.isLoading = true;
            const _selectedPlayerDetails = JSON.parse(JSON.stringify(this.selectedPlayerDetails));
            const {identity} = _selectedPlayerDetails;
            const obj = {
                firstName: identity['firstName'],
                lastName: identity['lastName'],
                reason: 'reason',
                comment: 'comment'
            }
            const url = `${config.SERVER_BASE_URL}/v1/claim/${claimReferenceNumber}/transactions/history`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            })
                .then(response => response.json())
                .then(res => {
                    if (res && res.error) {
                        this.successMessage = null;
                        this.errorMessage = res.error
                        this.showToast = true;
                    } else if (res && res.transactions) {
                        this.setPaymentHistoryData(res.transactions);
                    } else {
                        this.successMessage = 'No Results.';
                        this.errorMessage = null;
                        this.showToast = true;
                        this.paymentHistoryData = []
                    }
                })
                .catch((error) => {
                    this.errorMessage = error.toString();
                });
        }
    }
    
    @action clearESig(){
        this.eSignatureURL = null;
    }

    /*
    @action fetchESigFormForClaim() {
        const id = this.selectedClaimId;
        let isFailed = false;
        fetch(`${config.SERVER_BASE_URL}/v1/claim/${id}/ESig`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json application/pdf',
            },
        })
            .then(response => {
                if (!response.ok) {
                    this.setToastErrorSuccessMessage(true, 'No E-Signature is associated to this Claim.', null)
                    return
                }
                if(response.status === 404) {
                    this.successMessage = null;
                    this.errorMessage = 'No E-Signature is associated to this Claim';
                    this.showToast = true;
                    isFailed = true;
                    return 0;
                }
                return response.blob(); //Will need to examine the data coming back here
            })
            .then(data => this.eSignatureData = data)
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }
    */
    @action fetchW2GFormForClaim() {
        const id = this.selectedClaimId;
        let isFailed = false;
        fetch(`${config.SERVER_BASE_URL}/v1/claim/${id}/W2G`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json application/pdf',
            },
        })
            .then(response => {
                if (!response.ok) {
                    this.setToastErrorSuccessMessage(true, 'No W2G is attached to this Claim.', null)
                    return
                }
                if (response.status === 404) {
                    this.successMessage = null;
                    this.errorMessage = 'No W2G is attached to this Claim';
                    this.showToast = true;
                    isFailed = true;
                    return 0;
                }
                return response.blob();
            })
            .then(data => this.showFileNewTab(data, isFailed))
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    setSelectedTabKey(key) {
        this.selectedTabKey = key;
    }

    setPaymentDetails(data, cb) {
        this.paymentDetails = data;
        cb();
    }

    setSpinnerState(flag) {
        this.isSpinnerLoading = flag;
    }

    @action unlockUser(userData, cb) {
        if(userData && userData.id) {

            this.loading = true;
            const obj ={
                id: userData.id,
                username: userData.username
            }
            fetch(`${config.SERVER_BASE_URL}/v1/user/unlock`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json application/pdf',
                },
                body: JSON.stringify(obj),
            })
                .then(response => response.json())
                .then(res => {
                    if (res && res.error) {
                        this.mainSuccessMessage = null;
                        this.mainErrorMessage = res.error.toString();
                        this.showMainToast = true;
                        this.isSpinnerLoading = false;
                    } else if (res && res.success) {
                        this.mainErrorMessage = null;
                        this.mainSuccessMessage = 'User unlocked';
                        this.showMainToast = true;
                        this.isSpinnerLoading = false;
                        cb();
                    }
                })
                .catch((error) => {
                    this.mainErrorMessage = error.toString();
                    this.mainSuccessMessage = null;
                    this.showMainToast = true;
                    this.isSpinnerLoading = false;
                });
        }

    }

}
