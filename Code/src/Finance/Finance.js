import React from "react";
import {Button} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import CustomCard from "../dashboard/customCard";
import {checkRenderPermissions} from "../helpers";
import {permissions} from "../constants";

@inject('claimStore')
@observer
class Finance extends React.Component {

    navigateToClaimTransactions = () => {
        this.props.history.push('/finance/claims/transactions');
    }

    navigateToDailyReconciliationReport = () => {
        this.props.history.push('/finance/claims/dailyreconciliation');
    }
    
    render() {
        if(checkRenderPermissions(permissions.CAN_ACCESS_FINANCE_PAYMENTS_MODULE, JSON.parse(localStorage.getItem('userpolicies')))) {
            return (
                <div className='app-center-body'>
                    {checkRenderPermissions(permissions.CAN_SEE_ACH_ACTIVITY, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <CustomCard
                            title='ACH Activity'
                            handleCallback={() => this.navigateToClaimTransactions()}
                        /> : null}
                    {checkRenderPermissions(permissions.CAN_SEE_DAILY_RECONCILIATION, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <CustomCard
                            title='Daily Reconciliation Report'
                            handleCallback={() => this.navigateToDailyReconciliationReport()}
                        /> : null}
                </div>
            )
        } else {
            return <h3 className='unauthorized-header'>You do not have permission to view this page! Please contact your System
                Administrator!</h3>
        }

    }
}
export default Finance;
