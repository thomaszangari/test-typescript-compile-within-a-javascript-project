import React from "react";
import CustomCard from './customCard';
import './Dashboard.css'
import {checkRenderPermissions} from '../helpers';
import {permissions} from '../constants';
import {UserAction, UserActionCategory} from "../UserActionCategory";
import {inject} from "mobx-react";

@inject('playerStore')
class Dashboard extends React.Component {

    Name = "Dashboard";

    navigateTo = (path) => {

        if (path === '/claimsupport')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.CLAIM_SUPPORT);
        else if (path === '/playersupport')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_SUPPORT);
        else if (path === '/system/dashboard')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.SYSTEM_DASHBOARD);

        this.props.history.push(path);
    }

    render() {

        return (
            <div className='app-center-body'>
                {checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Claim Support'
                        handleCallback={() => this.navigateTo('/claimsupport')}
                    /> : null}
                {checkRenderPermissions(permissions.SEE_PLAYER_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Player Support'
                        handleCallback={() => this.navigateTo('/playersupport')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_ACCESS_FINANCE_PAYMENTS_MODULE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Finance / Payments'
                        handleCallback={() => this.navigateTo('/finance')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_SEE_SYSTEM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='System Support'
                        handleCallback={() => this.navigateTo('/system/dashboard')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_ACCESS_SECURITY_MODULE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Security'
                        handleCallback={() => this.navigateTo('/security/home')}
                    /> : null}
                {checkRenderPermissions(permissions.CAN_ACCESS_ANALYTICS_MODULE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Analytics'
                        handleCallback={() => this.navigateTo('/comingsoon')}
                    /> : null}
            </div>
        );
    }
}

export default Dashboard;