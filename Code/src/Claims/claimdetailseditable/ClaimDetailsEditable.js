import React from "react";
import './ClaimDetailsEditable.css';
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import config from "../../config";
import AppToast from "../../toast";
import TableComponent from "../../TableComponent";
import {Button} from "react-bootstrap";
import AppTextbox from "../../AppTextbox";
import {inject} from "mobx-react";

inject('authStore')
class ClaimDetailsEditable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: 'Ryan',
            lastName: 'Olsen',
            ticketNumber: '123',
            drawDate: '1990-12-25',
            game: 'LuckyDraw',
            ticketStatus: 'Pending',
            totalPrizeAmount: '4000',
            taxAmount: '50',
            netAmount: '4500',
            wagerAmount: '50',
            wagerType: 'Sample',
            paymentStatus: 'Pending',
            showSuccess: false,
            successMessage: '',
            showToast: false,
            userList: [],
            tableHeader: []
        }

    }

    componentDidMount() {
        const id = (this.props.match.params.id);
        this.setState({}, () => this.fetchClaimDetails(id));
        const res = [
            {
                status: 'status1',
                statusDate: '2020-12-01',
                claimsAgent: 'Ryan Feller',
                reasonCode: 'reason code1',
            },
            {
                status: 'status2',
                statusDate: '2020-06-01',
                claimsAgent: 'John Olsen',
                reasonCode: 'reason code1',
            },
            {
                status: 'status3',
                statusDate: '2020-04-01',
                claimsAgent: 'Sam Wyatt',
                reasonCode: 'reason code1',
            },
        ];
        this.setTableData(res);
    }

    fetchClaimDetails = (id) => {
        fetch(`${config.SERVER_BASE_URL}/v1/claim/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.setState({errorMessage: res.error});
                } else {
                    //this.setPlayerDetails(res[0]);
                }
            })
            .catch((error) => {
                this.setState({errorMessage: error.toString()});
            });
    }

    setTableData = (data) => {
        /*if (data.length === 0) {
            this.setState({showToast: true, userList: [], tableHeader: []});
        } else {
            const rows = data.map((d, index) => {
                d.idField = index + 1;
                d.select = <a onClick={(e) => this.handleSelectClick(e, d.id)} href='' className='select-link'>View</a>;
                return d;
            });

            const tableHeader = [
                {key: 'ticketnumber', label: 'Ticket#'},
                {key: 'firstname', label: 'First Name'},
                {key: 'lastname', label: 'Last Name'},
                {key: 'drawdate', label: 'Draw date'},
                {key: 'ticketstatus', label: 'Ticket Status'},
                {key: 'select', label: 'View'}
            ];
            this.setState({tableHeader: tableHeader, userList: rows});
        }*/

        const tableHeader = [
            {key: 'status', label: 'Status'},
            {key: 'statusDate', label: 'Status Date'},
            {key: 'claimsAgent', label: 'Claims Agent'},
            {key: 'reasonCode', label: 'Reason Code'}
        ];
        this.setState({tableHeader: tableHeader, userList: data});

    }

    renderClaimDetailsEditable() {
        const {
            showToast, showSuccess, successMessage,
            firstName, lastName, ticketNumber, drawDate, game,
            ticketStatus, totalPrizeAmount, taxAmount, netAmount,
            wagerAmount, wagerType, paymentStatus,
            tableHeader, userList
        } = this.state;
        return (
            <div className='player-details-container container-fluid '>
                {showToast
                    ? <AppToast showToast={showSuccess} message={successMessage} isSuccessMessage={true}
                                handleClose={() => this.handleToastClose('showSuccess')}/>
                    : null
                }
                <div className='claim-details-panel'>
                    <div className='claim-details-child '>
                        <div className='row'>
                            <div className='col-3'>
                                <div className='claim-details-label'>Ticket#</div>
                                <div className='claim-details-value'>{ticketNumber}</div>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>First Name</div>
                                <AppTextbox type='text' placeholder='Enter First Name' value={firstName}
                                            onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Last Name</div>
                                <AppTextbox type='text' placeholder='Enter Last Name' value={lastName}
                                            onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Ticket Status</div>
                                <div className='claim-details-value'>{ticketStatus}</div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <div className='claim-details-label'>Draw Date</div>
                                <div className='claim-details-value'>{drawDate}</div>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Game</div>
                                <div className='claim-details-value'>{game}</div>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Total Prize Amount</div>
                                <AppTextbox type='text' placeholder='Enter Total Prize Amount' value={totalPrizeAmount}
                                            onChange={(e) => this.handleInputChange(e, 'totalPrizeAmount')}/>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Tax Amount</div>
                                <AppTextbox type='text' placeholder='Enter Tax Amount' value={taxAmount}
                                            onChange={(e) => this.handleInputChange(e, 'taxAmount')}/>
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <div className='claim-details-label'>Net Amount</div>
                                <AppTextbox type='text' placeholder='Enter Net Amount' value={netAmount}
                                            onChange={(e) => this.handleInputChange(e, 'netAmount')}/>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Wager Amount</div>
                                <AppTextbox type='text' placeholder='Enter Wager Amount' value={wagerAmount}
                                            onChange={(e) => this.handleInputChange(e, 'wagerAmount')}/>
                            </div>

                            <div className='col-3'>
                                <div className='claim-details-label'>Wager Type</div>
                                <div className='claim-details-value'>{wagerType}</div>
                            </div>
                            <div className='col-3'>
                                <div className='claim-details-label'>Payment Status</div>
                                <div className='claim-details-value'>{paymentStatus}</div>
                            </div>
                        </div>
                        <div className='row'>
                            <TableComponent tableHeader={tableHeader} rowData={userList} className='search-table'/>
                        </div>
                    </div>
                    <hr className='separator'/>
                    <div className='row claim-button-row'>
                        <div className='offset-6 col-3 button-column'>
                            <Button disabled={false} className='claim-details-btn'
                                    onClick={() => this.handleSubmit()}>
                                Submit
                            </Button>
                        </div>
                        <div className='col-3 button-column'>
                            <Button className='claim-details-btn ' onClick={() => this.handleCancel()}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) &&
            checkRenderPermissions(permissions.UPDATE_CLAIMS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderClaimDetailsEditable();
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

export default ClaimDetailsEditable;
