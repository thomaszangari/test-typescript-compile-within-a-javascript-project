import React from "react";
import CustomCard from '../../../dashboard/customCard';
import './PlayerReports.css'
import {UserAction, UserActionCategory} from "../../../UserActionCategory";
import {inject} from "mobx-react";

@inject('playerStore')
class Playerreports extends React.Component {

    navigateTo = (path, query) => {

        if (path === '/playerreports/locked')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_REPORTS_LOCKED_ACCOUNTS);
        else if (path === '/playerreports/idfailed')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_REPORTS_IDOLOGY_FAILED_STATUS);
        else if (path === '/playerreports/noidcheck')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.PLAYER_REPORTS_NO_IDOLOGY_STATUS);
        else if (path === '/playerreports/custom')
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.CUSTOM_PLAYER_REPORT);

        if(query != ''){
            this.props.history.push({pathname: path, state: { detail: query }});
        }
        else{
            this.props.history.push(path);
        }
    }
    renderPlayerReports(){
        return(
            <div className='app-center-body'>
                { true /*checkRenderPermissions(permissions.UPDATE_PLAYER, JSON.parse(localStorage.getItem('userpolicies')))*/ ?
                <CustomCard
                    title='Locked Accounts'
                    //iconPath='/icons/claims_pencil.png'
                    handleCallback={() => this.navigateTo('/playerreports/locked', '?limit=100&accountenabled=false')}
                /> : null}
                { true /*checkRenderPermissions(permissions.RESET_PLAYER_PASSWORD, JSON.parse(localStorage.getItem('userpolicies')))*/ ?
                <CustomCard
                    title='Failed Identity Verification'
                    //iconPath='/icons/report_folders.png'
                    handleCallback={() => this.navigateTo('/playerreports/idfailed', '?limit=100&IDcheckresult=Failed')}
                /> : null}
                { true /*checkRenderPermissions(permissions.UNLOCK_PLAYER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies')))*/?
                <CustomCard
                    title='Incomplete Player Registration'
                    //iconPath='/icons/report_folders.png'
                    handleCallback={() => this.navigateTo('/playerreports/noidcheck', '?limit=100&IDchecksource=')}
                /> : null}
                { true /*checkRenderPermissions(permissions.SEE_PLAYER_VERIFICATION, JSON.parse(localStorage.getItem('userpolicies')))*/?
                    <CustomCard
                        title='Custom'
                        //iconPath='/icons/question_mark.png'
                        handleCallback={() => this.navigateTo('/playerreports/custom', '')}
                /> : null}
            </div>
        );
    }

    render() {
        var renderObj;

        if( true /*checkRenderPermissions(permissions.SEE_PLAYER_SUPPORT, JSON.parse(localStorage.getItem('userpolicies')))*/ ){
            renderObj = this.renderPlayerReports();
        }
        else{
            renderObj = <h1 class='unauthorized-header'>You do not have permission to view this page! Please contact your System Administrator!</h1>
        }

        return (
                renderObj
        );
    }
}

export default Playerreports;