import React from "react";
import CustomCard from '../../dashboard/customCard';
import './ClaimSupport.css';

import {checkRenderPermissions} from '../../helpers';
import {permissions} from '../../constants';

class ClaimSupport extends React.Component {

    navigateTo = (path) => {
        this.props.history.push(path);
    }

    renderClaimSupport() {
        return (
            <div className='app-center-body'>
                {checkRenderPermissions(permissions.PROCESS_CLAIMS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Process Claims'
                        handleCallback={() => this.navigateTo('/comingsoon')}
                    /> : null}
                {checkRenderPermissions(permissions.DO_CLAIM_RESEARCH, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Claim Research'
                        handleCallback={() => this.navigateTo('/claim/research')}
                    /> : null}
                {checkRenderPermissions(permissions.UPDATE_CLAIMS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Update Claim'
                        handleCallback={() => this.navigateTo('/claim/update')}
                    /> : null}
                {checkRenderPermissions(permissions.SEE_CLAIM_REPORTS_QUERIES, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Reports/Queries'
                        handleCallback={() => this.navigateTo('/claim/reports')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_REJECT_CLAIMS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Rejected Claims Queue'
                        handleCallback={() => this.navigateTo('/claim/reject')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_CHECK_REQUEST_CLAIMS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Claims Check Request'
                        handleCallback={() => this.navigateTo('/claim/check')}
                    /> : null}
            </div>
        );
    }

    render() {

        let renderObj;

        if (true) {
            renderObj = this.renderClaimSupport();
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

export default ClaimSupport;