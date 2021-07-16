import React from "react";
import TableComponent from "../TableComponent";

class Claimant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            tableHeader: [
                {key: 'ticketNumber', label: 'Ticket Number'},
                {key: 'game', label: 'Game'},
                {key: 'submitDate', label: 'Submit Date'},
                {key: 'prizeValue', label: 'Total Prize Value'},
                {key: 'totalTax', label: 'Total Taxes'},
                {key: 'netAmount', label: 'Net Amount'}
            ],
            userDetails: {},
            isUpdate: false
        }
    }
    componentDidMount() {
        const {user} = this.props;
        if (user && user.id) {
            // Write code to make API call - getUserDetail(user.id) => (req, res) {....}
            //Response object contain result of user id API call
            const response = {
                tableData: {
                    ticketNumber: '112-123-222442',
                    game: 'Test',
                    submitDate: '05/15/2020',
                    prizeValue: '$1250.00',
                    totalTax: '$1250.00',
                    netAmount: '$1250.00',
                },
                userDetails: {
                    firstName: 'John',
                    middleName: 'J.',
                    lastName: 'Smith',
                    dob: '03/12/1996',
                    ssn: '123-45-69435',
                    gender: 'Male',
                    email: 'jon@myemail.com',
                    phone: '123-456-7890',
                    address1: '123 ELM St',
                    address2: 'Apt 2',
                    city: 'My town ',
                    state: 'New york',
                    zip: '12345',
                    country: 'US',
                }
            }
            const _userData = [];
            const {tableData, userDetails} = response;
            _userData.push(tableData);
            this.setState({userData: _userData, userDetails: userDetails});
        }
    }
    getHeaderView = () => {
        return <div className='claimant-header-section'>
            <div className='claimant-header-label'>{this.state.isUpdate ? 'Update Player/Claimant Form' : 'Claimant'}</div>
            <div className='claimant-header-button' onClick={() => this.props.handleAction('modify')}>
                MODIFY
            </div>
        </div>
    }
    handleUpdate = (flag) => {
        this.setState({isUpdate: flag});
    }
    handleInputChange = (event, stateName) => {
        event.preventDefault();
        const _userDetails = this.state.userDetails
        _userDetails[stateName] = event.target.value;
        this.setState({userDetails: _userDetails})
    }
    render() {
        const {tableHeader, userData, userDetails, isUpdate} = this.state;
        const {handleAction} = this.props;
        const headerView = this.getHeaderView();
        return (
            <div className='claimant-container'>
                {
                    userData
                        ? <TableComponent className='claimant-table' header={headerView} tableHeader={tableHeader} rowData={userData} >
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='claimant-header'>First Name</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                     value={userDetails.firstName}
                                                     onChange={e => this.handleInputChange(e, 'firstName')}
                                                />
                                                : <div className='claimant-label'>{userDetails.firstName || ''}</div>
                                        }

                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Middle Initial</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.middleName}
                                                    onChange={e => this.handleInputChange(e, 'middleName')}
                                                />
                                                : <div className='claimant-label'>{userDetails.middleName || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Last Name</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.lastName}
                                                    onChange={e => this.handleInputChange(e, 'lastName')}
                                                />
                                                : <div className='claimant-label'>{userDetails.lastName || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Date Of Birth</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.dob}
                                                    onChange={e => this.handleInputChange(e, 'dob')}
                                                />
                                                : <div className='claimant-label'>{userDetails.dob || ''}</div>
                                        }
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='claimant-header'>SSN/FIN</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.ssn}
                                                    onChange={e => this.handleInputChange(e, 'ssn')}
                                                />
                                                : <div className='claimant-label'>{userDetails.ssn || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Gender</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.gender}
                                                    onChange={e => this.handleInputChange(e, 'gender')}
                                                />
                                                : <div className='claimant-label'>{userDetails.gender || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Email</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.email}
                                                    onChange={e => this.handleInputChange(e, 'email')}
                                                />
                                                : <div className='claimant-label'>{userDetails.email || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Phone</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.phone}
                                                    onChange={e => this.handleInputChange(e, 'phone')}
                                                />
                                                : <div className='claimant-label'>{userDetails.phone || ''}</div>
                                        }
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Mailing Address 1</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.address1}
                                                    onChange={e => this.handleInputChange(e, 'address1')}
                                                />
                                                : <div className='claimant-label'>{userDetails.address1 || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Mailing Address 2</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.address2}
                                                    onChange={e => this.handleInputChange(e, 'address2')}
                                                />
                                                : <div className='claimant-label'>{userDetails.address2 || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>City</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.city}
                                                    onChange={e => this.handleInputChange(e, 'city')}
                                                />
                                                : <div className='claimant-label'>{userDetails.city || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>State</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.state}
                                                    onChange={e => this.handleInputChange(e, 'state')}
                                                />
                                                : <div className='claimant-label'>{userDetails.state || ''}</div>
                                        }
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Zip</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.zip}
                                                    onChange={e => this.handleInputChange(e, 'zip')}
                                                />
                                                : <div className='claimant-label'>{userDetails.zip || ''}</div>
                                        }
                                    </div>
                                    <div className='col-3'>
                                        <div className='claimant-header'>Country</div>
                                        {
                                            isUpdate
                                                ? <input
                                                    type='text'
                                                    value={userDetails.country}
                                                    onChange={e => this.handleInputChange(e, 'country')}
                                                />
                                                : <div className='claimant-label'>{userDetails.country || ''}</div>
                                        }
                                    </div>
                                </div>
                                <div className='claimant-button'>
                                    <div className='qrc-button' onClick={() => handleAction('qrc')}>
                                        QRC
                                    </div>
                                    <div className='claimant-right-section'>
                                        {
                                            !isUpdate
                                                ? <>
                                                    <div className='accept-button' onClick={() => handleAction('update')}>
                                                        <img src='/icons/check_mark.png' />
                                                        ACCEPT
                                                    </div>
                                                    <div className='cancel-button' onClick={() => handleAction('cancel')}>
                                                        <img src='/icons/red_cross.png' />
                                                        REJECT
                                                    </div>
                                                    <div className='update-button' onClick={() => this.handleUpdate(true)}>
                                                        UPDATE
                                                    </div>
                                                </>
                                                : <>
                                                    <div className='accept-button' onClick={() => this.handleUpdate(false)}>
                                                        <img src='/icons/check_mark.png' />
                                                        UPDATE
                                                    </div>
                                                    <div className='cancel-button' onClick={() => this.handleUpdate(false)}>
                                                        <img src='/icons/red_cross.png' />
                                                        CANCEL
                                                    </div>
                                                </>
                                        }


                                    </div>
                                </div>
                            </div>
                        </TableComponent>
                        : null
                }
            </div>
        );
    }
}
export default Claimant;
