import React from 'react';
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import {inject, observer} from "mobx-react";
import ReactTable from "../../PaginatedTable/ReactTable";
import {toJS} from "mobx";
import AppToast from "../../toast";
import Spinner from "../../Spinner";
import {UserAction, UserActionCategory} from "../../UserActionCategory";

import './rejectClaim.css';

@inject('playerStore', 'claimStore')
@observer
class RejectClaim extends  React.Component {

    componentDidMount() {
        const userName = localStorage.getItem('loggedInUserFullName') || '';
        this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.VIEW_REJECTED_CLAIMS, '', '');
        const isClaimCheck = window.location.href.indexOf('claim/check') !== -1;
        this.props.claimStore.fetchRejectClaims(isClaimCheck);
    }

    handleViewDetailClick = (data) => {
        this.props.playerStore.setSelectedClaim(data, this.navigateToClaimDetails, true);
        // this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.SHOW_BATCH_FILE_PII, 'Transaction ID: '+target, 'User Name: '+userName);
    }
    navigateToClaimDetails = (data) => {
        const id  = this.props.playerStore.selectedClaimId;
        this.props.history.push(`/claim/${id}`);
    }

    renderView = () => {
        const {rejectedClaimsDetails} = this.props.claimStore;
        if(rejectedClaimsDetails === null) {
            return (
                <div className='search-claim-container container-fluid'>
                    <Spinner />
                </div>
            )
        }
        const {tableHeader, tableRows} = rejectedClaimsDetails;
        const rows = toJS(JSON.parse(JSON.stringify(tableRows)));
        const headers = toJS(JSON.parse(JSON.stringify(tableHeader)));
        if(headers.length > 0 && rows.length > 0 &&
            checkRenderPermissions(permissions.CAN_SEE_REJECT_CLAIMS_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            headers.push({key: 'view', label: ''});
            rows.forEach(row => {
                row.view = <a onClick={() => this.handleViewDetailClick(row)} className='reject-link'>View</a>
            })
        }

        return (
            <div className='reject-claim-container container-fluid'>
                <div className='reject-claim-panel'>
                    {
                        headers && headers.length > 0
                            ? <ReactTable tableHeader={headers} rowData={rows} className='search-claim-data-table'/>
                            : null
                    }
                </div>
            </div>
        );
    }
    render() {
        let renderObj;

        if (checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) &&
            checkRenderPermissions(permissions.CAN_SEE_REJECT_CLAIMS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderView();
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

export default RejectClaim;
