import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import './SettingsHub.css';
import AppToast from "../../../toast";
import {inject, observer} from "mobx-react";
import MFABypassRule from "../Tabs/MFABypassRule";
import {checkRenderPermissions} from "../../../helpers";
import {permissions} from "../../../constants";

@inject('settingsStore')
@observer
class SettingsHub extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'MFA Bypass Rule',
            selectedIndex: 0
        }
    }

    componentDidMount() {
//        this.props.playerStore.getPlayerDetails();
    }

    handleToastClose = () => {
        //const navigateToFirstTab = this.props.playerStore.playerHubNavigateToFirstTab;
        //this.props.settingsStore.setToast(false);
        //if (navigateToFirstTab)
        //  this.navigateToFirstTab();
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    handleSelect = (key) => {
        //this.props.playerStore.logAction(UserActionCategory.TAB_VIEW, key, target);
        this.setState({key})
    }

    navigateToFirstTab = () => {
        this.handleSelect('MFA Bypass Rule');
    }

    renderSettingsHub() {

        const {showToast, successMessage, errorMessage} = this.props.settingsStore;

        return (
            <div className='app-tab-panel'>
                {showToast
                    ?
                    <AppToast showToast={showToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }
                <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={(key) => this.handleSelect(key)}
                >
                    {checkRenderPermissions(permissions.CAN_SEE_MFA_BYPASS_RULES, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey="MFA Bypass Rule" title="MFA Bypass Rules">
                            <MFABypassRule {...this.props}/>
                        </Tab> : null}
                </Tabs>
            </div>
        );
    }

    render() {
        var renderObj;

        if (checkRenderPermissions(permissions.CAN_ACCESS_SETTINGS, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderSettingsHub();
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

export default SettingsHub;