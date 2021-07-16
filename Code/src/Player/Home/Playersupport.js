import React from "react";
import CustomCard from '../../dashboard/customCard';
import './Playersupport.css'
import {checkRenderPermissions} from '../../helpers';
import {permissions} from '../../constants';
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import {inject} from "mobx-react";

@inject('playerStore', 'authStore')
class Playersupport extends React.Component {

    componentDidMount() {
        localStorage.removeItem('searchFirstName');
        localStorage.removeItem('searchLastName');
        localStorage.removeItem('phone');
        localStorage.removeItem('email');
    }

    navigateTo = (path) => {

        if (path === '/player/search')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_MAINTENANCE);
        else if (path === '/playerreports')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_SERVICE_REPORTS);

        this.props.history.push(path);
    }

    renderPlayerSupport() {
        return (
            <div className='app-center-body'>
                {true ?
                    <CustomCard
                        title='Player Maintenance'
                        handleCallback={() => this.navigateTo('/player/search')}
                    /> : null}
                {checkRenderPermissions(permissions.SEE_PLAYER_SERVICE_REPORTS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <CustomCard
                        title='Player Services Reports'
                        handleCallback={() => this.navigateTo('/playerreports')}
                    /> : null}
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.SEE_PLAYER_SUPPORT, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderPlayerSupport();
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

export default Playersupport;