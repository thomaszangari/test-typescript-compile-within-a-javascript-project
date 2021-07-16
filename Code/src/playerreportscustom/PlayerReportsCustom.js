import React from "react";
import {Button} from "react-bootstrap";
import './PlayerReportsCustom.css';
import AppToast from "../toast";
import AppTextbox from "../AppTextbox";

class PlayerReportsCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            city: '',
            state: '',
            zipcode: '',
            enabledval: 3,
            idcheckresultval: 3,
            statusval: 4,
            cognitostatusval: 8,
            idchecksourceval: 3,
            enabled: [{
                id: 1,
                value: 'Yes'
            }, {
                id: 2,
                value: 'No'
            }, {
                id: 3,
                value: ''
            }],
            idcheckresult: [{
                id: 1,
                value: 'Passed'
            }, {
                id: 2,
                value: 'Failed'
            }, {
                id: 3,
                value: ''
            }],
            status: [{
                id: 1,
                value: 'Registration Incomplete'
            }, {
                id: 2,
                value: 'Valid Identity'
            }, {
                id: 3,
                value: 'Invalid Identity'
            }, {
                id: 4,
                value: ''
            }],
            cognitostatus: [{
                id: 1,
                value: 'Unconfirmed'
            }, {
                id: 2,
                value: 'Confirmed'
            }, {
                id: 3,
                value: 'Archived'
            }, {
                id: 4,
                value: 'Compromised'
            }, {
                id: 5,
                value: 'Unknown'
            }, {
                id: 6,
                value: 'Reset Required'
            }, {
                id: 7,
                value: 'Force Change Password'
            }, {
                id: 8,
                value: ''
            }],
            idchecksource: [{
                id: 1,
                value: 'Experian'
            }, {
                id: 2,
                value: 'Back Office'
            }, {
                id: 3,
                value: ''
            }]
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
        this.props.history.push({pathname: path, state: { detail: query }});
    }

    getFieldValue(obj, key){
        return obj.find((e) => e.id === key).value;
    }

    onSearch(){
        var queryStr = '?limit=100';
        console.log('state');
        console.log(this.state);

        var enabledstr = this.getFieldValue(this.state.enabled, this.state.enabledval);
        var idcheckresultstr = this.getFieldValue(this.state.idcheckresult, this.state.idcheckresultval);
        var statusstr = this.getFieldValue(this.state.status, this.state.statusval);
        var idchecksourcestr = this.getFieldValue(this.state.idchecksource, this.state.idchecksourceval);
        var cognitostr = this.getFieldValue(this.state.cognitostatus, this.state.cognitostatusval);

        if(this.state.firstName != ""){
            queryStr += "&firstname=";
            queryStr += this.state.firstName;
        }
        if(this.state.lastName != ""){
            queryStr += "&lastname=";
            queryStr += this.state.lastName;
        }
        if(this.state.zipcode != ""){
            queryStr += "&zipcode=";
            queryStr += this.state.zipcode;
        }
        if(this.state.state != ""){
            queryStr += "&state=";
            queryStr += this.state.state;
        }
        if(this.state.city != ""){
            queryStr += "&city=";
            queryStr += this.state.city;
        }
        if(enabledstr != ""){
            queryStr += "&accountenabled=";

            if(enabledstr === "Yes"){
                queryStr += "Disabled";
            } else{
                queryStr += "Enabled";
            }
        }
        if(idcheckresultstr != ""){
            queryStr += "&IDcheckresult=";
            if (idchecksourcestr === "Passed") {
                queryStr += "PASS";
            } else {
                queryStr += "FAIL";
            }
        }
        if(idchecksourcestr != ""){
            queryStr += "&IDchecksource=";
            if(idchecksourcestr === "Experian") {
                queryStr += "EXPERIAN";
            } else {
                queryStr += "BACK OFFICE";
            }
        }
        if(statusstr != ""){
            queryStr += "&status="
            if (statusstr === "Registration Incomplete") {
                queryStr += "NO_IDENTITY";
            } else if (statusstr === "Invalid Identification") {
                queryStr += "INVALID_IDENTITY";
            } else {
                queryStr += "VALID_IDENTITY";
            }
        }
        if(cognitostr != ""){
            queryStr += "&cognitostatus=";
            if (cognitostr === "Reset Required") {
                queryStr += "RESET_REQUIRED";
            } else if (cognitostr === "Force Changed Password") {
                queryStr += "FORCE_CHANGE_PASSWORD";
            } else {
                queryStr += cognitostr.toUpperCase();
            }
            queryStr += cognitostr;
        }

        this.navigateTo('/playerreports/customtable', queryStr);
    }

    render() {
        const {
            showToast, showSuccess, successMessage, firstName, lastName, city, state, zipcode, enabledval, idcheckresultval, statusval, cognitostatusval, idchecksourceval, enabled, idcheckresult, status, cognitostatus, idchecksource
        } = this.state;
        let isDisabled = true;

        if(lastName || city || state || zipcode || enabledval!=3 || idcheckresultval!=3 || statusval!=4 || cognitostatusval!=8 || idchecksourceval!=3){
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
                                    <div className='player-reports-label'>City</div>
                                    <AppTextbox type='text' placeholder='Enter City' value={city}
                                                onChange={(e) => this.handleInputChange(e, 'city')}/>
                                </div>
                                <div className='col-2'>
                                    <div className='player-reports-label'>State</div>
                                    <AppTextbox type='text' placeholder='Enter State' value={state}
                                                onChange={(e) => this.handleInputChange(e, 'state')}/>
                                </div>
                                <div className='col-2'>
                                    <div className='player-reports-label'>Zip Code</div>
                                    <AppTextbox type='text' placeholder='Enter Zip Code' value={zipcode}
                                                onChange={(e) => this.handleInputChange(e, 'zipcode')}/>
                                </div>
                                <div className='col-2'>
                                    <div className='player-details-label'>Account Locked?</div>
                                    <select value={enabledval} onChange={(e) => this.handleSelectChange(e, 'enabledval')}>
                                        {
                                            enabled.map(val => {
                                                return <option value={val.id}>{val.value}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-2'>
                                    <div className='player-details-label'>Identity Check Result</div>
                                    <select value={idcheckresultval} onChange={(e) => this.handleSelectChange(e, 'idcheckresultval')}>
                                        {
                                            idcheckresult.map(val => {
                                                return <option value={val.id}>{val.value}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <div className='player-details-label'>Player Identity Status</div>
                                    <select value={statusval} onChange={(e) => this.handleSelectChange(e, 'statusval')}>
                                        {
                                            status.map(val => {
                                                return <option value={val.id}>{val.value}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <div className='player-details-label'>Identity Verification Source</div>
                                    <select value={idchecksourceval} onChange={(e) => this.handleSelectChange(e, 'idchecksourceval')}>
                                        {
                                            idchecksource.map(val => {
                                                return <option value={val.id}>{val.value}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <div className='player-details-label'>Player Registration Status</div>
                                    <select value={cognitostatusval} onChange={(e) => this.handleSelectChange(e, 'cognitostatusval')}>
                                        {
                                            cognitostatus.map(val => {
                                                return <option value={val.id}>{val.value}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='row'>
                                <div className = 'col-1 report-search-container'>
                                    <Button disabled={isDisabled} className='report-search-btn' onClick={() => this.onSearch()}>
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

export default PlayerReportsCustom;
