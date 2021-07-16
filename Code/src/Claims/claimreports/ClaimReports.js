import React from "react";
import CustomCard from '../../dashboard/customCard';
import './ClaimReports.css'
import {checkRenderPermissions} from '../../helpers';
import {permissions} from '../../constants';

class ClaimReports extends React.Component {

    navigateTo = (path, query) => {
        if (query != '') {
            this.props.history.push({pathname: path, state: {detail: query}});
        } else {
            this.props.history.push(path);
        }
    }

    renderClaimReports() {
        return (
            <div className='app-center-body'>
                {checkRenderPermissions(permissions.CAN_SEE_TICKET_STATUS_CLAIMED_CLAIM_REPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Ticket Status – Claimed'
                        handleCallback={() => this.navigateTo('/comingsoon', '?limit=100&accountenabled=false')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_DRAW_DATE_7_DAYS_CLAIM_REPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Draw Date – 7 Days'
                        handleCallback={() => this.navigateTo('/comingsoon', '?limit=100&IDcheckresult=Failed')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_DRAW_DATE_30_DAYS_CLAIM_REPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Draw Date – 30 Days'
                        handleCallback={() => this.navigateTo('/comingsoon', '?limit=100&IDchecksource=')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_CUSTOM_CLAIM_REPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Custom'
                        handleCallback={() => this.navigateTo('/comingsoon')}
                    /> : null}
            </div>
        );
    }

    render() {
        var renderObj;

        if (true) {
            renderObj = this.renderClaimReports();
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

export default ClaimReports;