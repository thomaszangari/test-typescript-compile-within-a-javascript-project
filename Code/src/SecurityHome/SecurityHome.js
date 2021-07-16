import React from "react";
import CustomCard from '../dashboard/customCard';
import './SecurityHome.css'
import {checkRenderPermissions} from '../helpers';
import {permissions} from '../constants';
import {UserAction, UserActionCategory} from "../UserActionCategory";
import {inject} from "mobx-react";

@inject('playerStore')
class SecurityHome extends React.Component {

    componentDidMount() {

    }

    navigateTo = (path) => {

        if (path === '/security/frequentcasher')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.FREQUENT_CASHER);

        this.props.history.push(path);
    }

    renderSecurityHome() {
        return (
            <div className='app-center-body'>
                {checkRenderPermissions(permissions.CAN_ACCESS_FREQUENT_CASHER_MODULE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Frequent Casher'
                        handleCallback={() => this.navigateTo('/security/frequentcasher')}
                    /> : null}
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.CAN_ACCESS_SECURITY_MODULE, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderSecurityHome();
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

export default SecurityHome;