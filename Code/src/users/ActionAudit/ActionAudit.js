import React from "react";
import {inject, observer} from "mobx-react";
import AppToast from "../../toast";
import AuditSearch from "../AuditSearch";
import config from "../../config";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import ReactTable from "../../PaginatedTable/ReactTable";

@inject('playerStore', 'authStore')
@observer
class ActionAudit extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const id = (this.props.match.params.id);
        const username = this.props.playerStore.selectedBackofficeUserName;
        this.props.playerStore.AuditActionsTableHeader = null;
        this.props.playerStore.AuditActionsTableRows = null;
        fetch(`${config.SERVER_BASE_URL}/v1/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res) {
                    const {firstname, lastname} = res;
                    this.props.playerStore.UserNameTitleText = `User: ${firstname} ${lastname}`;
                }
            })
            .catch((error) => {
                let errorMessage = error.toString();
            });
        this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.USER_AUDIT_HISTORY_PAGE, username);
    }

    handleToastClose = () => {
        this.props.playerStore.setToast(false);
    }

    onSearchClick = (startDate='', endDate='', action='') => {

        startDate.setHours(0,0,0,0);
        startDate = new Date(startDate).toUTCString();
        endDate.setHours(0,0,0,0);
        endDate = new Date(endDate).toUTCString();

        let queryParams = '?';
        if (startDate && startDate !== '') {
            queryParams += `startDate=${startDate}`
        }
        if (endDate && endDate !== '') {
            if (queryParams.endsWith("?"))
                queryParams += `endDate=${endDate}`
            else
                queryParams += `&endDate=${endDate}`
        }
        if (action && action !== '') {
            if (queryParams.endsWith("?"))
                queryParams += `action=${action}`
            else
                queryParams += `&action=${action}`
        }

        this.props.playerStore.searchUserAuditActions(queryParams);
    }

    renderActionAudit() {
        const {AuditActionsTableHeader, AuditActionsTableRows, showToast, successMessage, errorMessage} = this.props.playerStore;
        let Timestamp;
        const rows = AuditActionsTableRows && AuditActionsTableRows.map((d, index) => {
            d.idField = index + 1;
            Timestamp = `${d.timestamp}`
            d.date = Timestamp.substring(0, 10)
            d.time = Timestamp.substring(11, 19)
            d.actions = `${d.category} : ${d.action}`
            d.data =  d.comments ? `${d.result} : ${d.comments}` : `${d.result}`
            return d;
        });
        return (
            <div className='player-search-container container-fluid'>
                <div className='player-search-panel player-search-child'>
                    <AuditSearch tableHeader={AuditActionsTableHeader} userList={rows} handleSearchClick={this.onSearchClick} {...this.props}/>
                </div>
                {
                    AuditActionsTableHeader && rows
                        ? <ReactTable tableHeader={AuditActionsTableHeader} rowData={rows} className='update-user-table'/>
                        : null
                }
                {showToast
                    ?
                    <AppToast showToast={showToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }
            </div>
        );

    }

    render() {
        let renderObj;
        if (true) {
            renderObj = this.renderActionAudit();
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

export default ActionAudit;
