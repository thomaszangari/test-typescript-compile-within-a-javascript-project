import React from "react";
import TableComponent from "../TableComponent";
import Claimant from './claimant';
import './processClaim.css';
import {checkRenderPermissions} from "../helpers";
import {permissions} from "../constants";

class ProcessClaimsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [{
                id: 1,
                dateReceived: 1,
                dateProcess: 'test1@gmail.com',
                ticketStatus: 'Super User',
                process: <a onClick={(e) => this.handleProcessClick(e, 1)} href=''
                            className='process-claim-link'>Process</a>,
                game: 'User 1',
                amount: 'User 1',
                lastName: 'User 1'
            }, {
                id: 2,
                dateReceived: 3,
                dateProcess: 'test3@gmail.com',
                ticketStatus: 'Admin',
                process: <a onClick={(e) => this.handleProcessClick(e, 2)} href=''
                            className='process-claim-link'>Process</a>,
                game: 'User 3',
                amount: 'User 3',
                lastName: 'User 3'
            }, {
                id: 3,
                dateReceived: 2,
                dateProcess: 'test4@gmail.com',
                ticketStatus: 'Claim Agent',
                process: <a onClick={(e) => this.handleProcessClick(e, 3)} href=''
                            className='process-claim-link'>Process</a>,
                game: 'User 4',
                amount: 'User 4',
                lastName: 'User 4'
            }],
            tableHeader: [
                {key: 'dateReceived', label: 'user ID'},
                {key: 'dateProcess', label: 'User Name'},
                {key: 'ticketStatus', label: 'Role'},
                {key: 'game', label: 'Game'},
                {key: 'amount', label: 'Amount'},
                {key: 'lastName', label: 'Last Name'},
                {key: 'process', label: 'Process'},
            ],
            selectedUser: null
        }
    }

    handleProcessClick = (e, id) => {
        e.preventDefault();
        const {userList} = this.state;
        const _selectedUser = userList.find(user => user.id === id);
        this.setState({selectedUser: _selectedUser})
    }
    handleButtonClick = (actionStr) => {
        if (actionStr === 'update' || actionStr === 'cancel') {
            this.setState({selectedUser: null})
        }
    }

    renderProcessClaims() {
        const {userList, tableHeader, selectedUser} = this.state;
        return (
            <div className='process-claim-container app-center-body'>
                <div className='process-claim-child'>
                    {
                        selectedUser
                            ? <Claimant user={selectedUser} handleAction={this.handleButtonClick}/>
                            : <TableComponent header='Claim Processing Center' tableHeader={tableHeader}
                                              rowData={userList}/>
                    }
                </div>
            </div>
        );
    }


    render() {

        let renderObj;

        if (checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) &&
            checkRenderPermissions(permissions.PROCESS_CLAIMS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderProcessClaims();
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

export default ProcessClaimsComponent;
