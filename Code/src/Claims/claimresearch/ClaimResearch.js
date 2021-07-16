import React from "react";
import './ClaimResearch.css';
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import AppToast from "../../toast";
import ClaimSearch from "../claimsearch";
import config from "../../config";
import ReactTable from "../../PaginatedTable/ReactTable";

class ClaimResearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            tableHeader: [
                {key: 'ticketnumber', label: 'Ticket#'},
                {key: 'firstname', label: 'First Name'},
                {key: 'lastname', label: 'Last Name'},
                {key: 'drawdate', label: 'Draw date'},
                {key: 'ticketstatus', label: 'Ticket Status'},
                {key: 'select', label: 'View'}
            ],
            showToast: false
        }
    }

    componentDidMount() {

    }

    onToastClose = () => {
        this.setState({showToast: false});
    }

    handleSelectClick = (event, id) => {
        event.preventDefault();
        this.props.history.push(`/claim/view/${id}`);
    }

    setTableData = (data) => {
        if (data.length === 0) {
            this.setState({showToast: true, userList: [], tableHeader: []});
        } else {
            const rows = data.map((d, index) => {
                d.idField = index + 1;
                d.select = checkRenderPermissions(permissions.DO_CLAIM_RESEARCH, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <a onClick={(e) => this.handleSelectClick(e, d.id)} href='' className='select-link'>View</a> : null;
                return d;
            });

            this.setState({userList: rows});
        }
    }

    onSearchClick = (firstName = '', lastName = '', drawDate = '', ticketStatus = '', paymentStatus = '') => {

        let queryParams = 'limit=50';
        if (firstName && firstName !== '') {
            queryParams += `&firstname=${firstName}`
        }
        if (lastName && lastName !== '') {
            queryParams += `&lastname=${lastName}`
        }
        if (drawDate && drawDate !== '') {
            queryParams += `&drawdate=${drawDate}`
        }
        if (ticketStatus && ticketStatus !== '') {
            queryParams += `&ticketstatus=${ticketStatus}`
        }
        if (paymentStatus && paymentStatus !== '') {
            queryParams += `&paymentstatus=${paymentStatus}`
        }

        fetch(`${config.SERVER_BASE_URL}/v1/claim/search?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.setState({errorMessage: res.error});
                } else {
                    this.setTableData(res);
                }
            })
            .catch((error) => {
                this.setState({errorMessage: error.toString()});
            });
    }

    renderClaimResearch() {
        const {tableHeader, userList, showToast} = this.state;
        const msg = 'No Results found.';
        return (
            <div className='claim-search-container container-fluid'>
                <div className='claim-search-panel claim-search-child'>
                    <ClaimSearch handleSearchClick={this.onSearchClick}/>
                </div>
                {
                    userList && userList.length > 0 && tableHeader
                        ? <ReactTable tableHeader={tableHeader} rowData={userList} className='update-user-table'/>
                        : null
                }
                {
                    showToast ? <AppToast showToast={showToast} message={msg} isSuccessMessage={true}
                                          handleClose={this.onToastClose}/> : null
                }
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) &&
            checkRenderPermissions(permissions.DO_CLAIM_RESEARCH, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderClaimResearch();
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

export default ClaimResearch;
