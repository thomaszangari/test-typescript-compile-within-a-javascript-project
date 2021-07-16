import React from "react";
import {Button} from "react-bootstrap";
import './ClaimReportsCustom.css';
import AppToast from "../../toast";
import AppTextbox from "../../AppTextbox";

class ClaimReportsCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            drawDate:'',
            ticketStatus:'',
            paymentStatus:''
        }
    }

    handleInputChange = (e, stateName) => {
        if (stateName === 'firstName' || stateName === 'lastName'
            || stateName === 'city' || stateName === 'state' || stateName === 'county') {
            const regExp = /^[A-Za-z]+$/;
            if (e.target.value === '' || (regExp.test(e.target.value))) {
                this.setState({[stateName]: e.target.value})
            }
        } else if (stateName === 'cellPhone') {
            const re = /^[0-9\b]+$/;
            if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 10)) {
                this.setState({[stateName]: e.target.value})
            }
        } else if (stateName === 'email') {
            const isValid = this.isEmailValid(e.target.value);
            this.setState({[stateName]: e.target.value, isValidEmail: !!isValid});
        } else if (stateName === 'zipcode') {
            const regExp = /^[0-9\b]+$/;
            if (e.target.value === '' || (regExp.test(e.target.value) && e.target.value.length <= 5)) {
                this.setState({[stateName]: e.target.value})
            }
        } else {
            this.setState({[stateName]: e.target.value});
        }
    }

    handleToastClose = (stateName) => {
        if (this.state.onYesClicked) {
            this.props.history.goBack();
        } else {
            this.setState({showSuccess: false, successMessage: '', showToast: false})
        }
    }

    handleSelectChange = (e, stateName) => {
        const val = Number(e.target.value);
        this.setState({[stateName]: val});
    }

    navigateTo = (path, query) => {
        console.log(query);
        this.props.history.push({pathname: path, state: {detail: query}});
    }

    getFieldValue(obj, key) {
        return obj.find((e) => e.id === key).value;
    }

    onSearch() {

        var queryStr = '?limit=100';

        if (this.state.firstName != "") {
            queryStr += "&firstname=";
            queryStr += this.state.firstName;
        }
        if (this.state.lastName != "") {
            queryStr += "&lastname=";
            queryStr += this.state.lastName;
        }
        if (this.state.drawDate != "") {
            queryStr += "&drawDate=";
            queryStr += this.state.drawDate;
        }
        if (this.state.ticketStatus != "") {
            queryStr += "&ticketStatus=";
            queryStr += this.state.ticketStatus;
        }
        if (this.state.paymentStatus != "") {
            queryStr += "&paymentStatus=";
            queryStr += this.state.paymentStatus;
        }

        this.navigateTo('/claimreports/customtable', queryStr);
    }

    render() {
        const {
            showToast, showSuccess, successMessage, firstName,
            lastName, drawDate, ticketStatus, paymentStatus
        } = this.state;
        let isDisabled = true;

        if (firstName || lastName || drawDate || ticketStatus || paymentStatus) {
            isDisabled = false;
        }

        return (
            <div class='player-report-container container-fluid'>
                {showToast
                    ? <AppToast showToast={showSuccess} message={successMessage} isSuccessMessage={true}
                                handleClose={() => this.handleToastClose('showSuccess')}/>
                    : null
                }

                <div className='player-reports-panel'>
                    <div className='player-reports-child '>
                        <div className='row'>
                            <div className='col-2'>
                                <div className='player-reports-label'>First Name</div>
                                <AppTextbox type='text' placeholder='Enter First Name' value={firstName}
                                            onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                            </div>
                            <div className='col-2'>
                                <div className='player-reports-label'>Last Name</div>
                                <AppTextbox type='text' placeholder='Enter Last Name' value={lastName}
                                            onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                            </div>
                            <div className='col-2'>
                                <div className='player-reports-label'>Draw Date</div>
                                <AppTextbox type='text' value={drawDate}
                                            onChange={(e) => this.handleInputChange(e, 'drawDate')}/>
                            </div>
                            <div className='col-2'>
                                <div className='player-reports-label'>TicketStatus</div>
                                <AppTextbox type='text' value={ticketStatus}
                                            onChange={(e) => this.handleInputChange(e, 'ticketStatus')}/>
                            </div>
                            <div className='col-2'>
                                <div className='player-reports-label'>Payment Status</div>
                                <AppTextbox type='text' value={paymentStatus}
                                            onChange={(e) => this.handleInputChange(e, 'paymentStatus')}/>
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-1 report-search-container'>
                                <Button disabled={isDisabled} className='report-search-btn'
                                        onClick={() => this.onSearch()}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClaimReportsCustom;