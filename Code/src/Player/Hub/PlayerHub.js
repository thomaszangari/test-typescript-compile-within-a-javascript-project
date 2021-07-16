import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import './PlayerHub.css';
import Details from "../Tabs/Details";
import KYCVerification from "../Tabs/KYCVerification";
import ConfirmEmail from "../Tabs/ConfirmEmail";
import LockUnlock from "../Tabs/LockUnlock";
import TicketHistory from "../Tabs/TicketHistory";
import UpdateProfile from "../Tabs/UpdateProfile";
import EventHistory from "../Tabs/EventHistory";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import {UserActionCategory} from "../../UserActionCategory";
import AppToast from "../../toast";
import {inject, observer} from "mobx-react";
import ClaimHistory from "../Tabs/ClaimHistory";
import EnableDisable from "../Tabs/EnableDisable";


//  Constant Tab Keys
const PLAYER_DETAILS = 'Player Details';
const UPDATE_PLAYER_PROFILE = 'Update Player Profile';
const CONFIRM_EMAIL = 'Confirm Email';
const LOCK_UNLOCK_PLAYER = 'Lock Unlock Player';
const ENABLE_DISABLE_SCANS = 'Enable Disable Player Scans';
const VERIFY_PLAYER = 'Verify Player';
const TICKET_HISTORY = 'Ticket History';
const EVENT_HISTORY = 'Event History';
const CLAIM_HISTORY = 'Claim History';

//  Constant Tab Titles
const PLAYER_DETAILS_TITLE = 'Details';
const UPDATE_PLAYER_PROFILE_TITLE = 'Update Profile';
const CONFIRM_EMAIL_TITLE = 'Confirm Email';
const LOCK_UNLOCK_PLAYER_TITLE = 'Lock/Unlock';
const ENABLE_DISABLE_PLAYER_TITLE = 'Ticket Scanner Activity';
const VERIFY_PLAYER_TITLE = 'KYC Verification';
const TICKET_HISTORY_TITLE = 'Ticket History';
const EVENT_HISTORY_TITLE = 'Event History';
const CLAIM_HISTORY_TITLE = 'Claims';

@inject('playerStore')
@observer
class PlayerHub extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     tabKey: PLAYER_DETAILS,
        //     selectedIndex: 0
        // }
    }

    componentDidMount() {
        //alert('hi')
        this.props.playerStore.getPlayerDetails();
    }

    handleToastClose = () => {
        const navigateToFirstTab = this.props.playerStore.playerHubNavigateToFirstTab;
        this.props.playerStore.setToast(false);
        if (navigateToFirstTab)
            this.navigateToFirstTab();
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    handleSelect = (key) => {
        let firstName = '';
        let lastName = '';
        const {selectedPlayerDetails} = this.props.playerStore;
        if (selectedPlayerDetails) {
            const {identity} = selectedPlayerDetails;
            if (identity) {
                firstName = identity['firstName'];
                lastName = identity['lastName'];
            }
        }
        const target = `Player Name: ${firstName} ${lastName}`;
        if(key !== CLAIM_HISTORY) {
            this.props.playerStore.logAction(UserActionCategory.TAB_VIEW, key, target);
        }

        if (key === PLAYER_DETAILS) {
            this.props.playerStore.getPlayerDetails();
            // this.setState({tabKey: key}, () => this.props.playerStore.getPlayerDetails())
        }
        this.props.playerStore.setSelectedTabKey(key);
        // else {
        //     this.setState({tabKey: key})
        // }

    }

    navigateToFirstTab = () => {
        this.handleSelect(PLAYER_DETAILS);
    }

    render() {

        const {showToast, successMessage, errorMessage} = this.props.playerStore;
        const tabKey = this.props.playerStore.selectedTabKey;
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
                    activeKey={tabKey}
                    onSelect={(key) => this.handleSelect(key)}
                >
                    <Tab eventKey={PLAYER_DETAILS} title={PLAYER_DETAILS_TITLE}>
                        {tabKey === PLAYER_DETAILS ? <Details {...this.props}/> : null}
                    </Tab>
                    {checkRenderPermissions(permissions.UPDATE_PLAYER, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={UPDATE_PLAYER_PROFILE} title={UPDATE_PLAYER_PROFILE_TITLE}>
                            {tabKey === UPDATE_PLAYER_PROFILE ? <UpdateProfile navigateToFirstTab={this.navigateToFirstTab} {...this.props} /> : null }
                        </Tab> : null}
                    {checkRenderPermissions(permissions.CAN_CONFIRM_PLAYER_EMAIL, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={CONFIRM_EMAIL} title={CONFIRM_EMAIL_TITLE}>
                            {tabKey === CONFIRM_EMAIL ? <ConfirmEmail navigateToFirstTab={this.navigateToFirstTab} {...this.props}/> : null }
                        </Tab> : null}
                    {checkRenderPermissions(permissions.UNLOCK_PLAYER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={LOCK_UNLOCK_PLAYER} title={LOCK_UNLOCK_PLAYER_TITLE}>
                            {tabKey === LOCK_UNLOCK_PLAYER ? <LockUnlock navigateToFirstTab={this.navigateToFirstTab} {...this.props}/> : null }
                        </Tab> : null}
                    {checkRenderPermissions(permissions.ENABLE_PLAYER_SCANS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={ENABLE_DISABLE_SCANS} title={ENABLE_DISABLE_PLAYER_TITLE}>
                            {tabKey === ENABLE_DISABLE_SCANS ? <EnableDisable navigateToFirstTab={this.navigateToFirstTab} {...this.props}/> : null }
                        </Tab> : null}
                    {checkRenderPermissions(permissions.SEE_PLAYER_VERIFICATION, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={VERIFY_PLAYER} title={VERIFY_PLAYER_TITLE}>
                            {tabKey === VERIFY_PLAYER ? <KYCVerification navigateToFirstTab={this.navigateToFirstTab} {...this.props}/> : null}
                        </Tab> : null}
                    {checkRenderPermissions(permissions.CAN_SEE_PLAYER_TICKET_HISTORY, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={TICKET_HISTORY} title={TICKET_HISTORY_TITLE}>
                            {tabKey === TICKET_HISTORY ? <TicketHistory {...this.props}/> : null}
                        </Tab> : null}
                    {checkRenderPermissions(permissions.CAN_SEE_PLAYER_EVENT_HISTORY, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={EVENT_HISTORY} title={EVENT_HISTORY_TITLE}>
                            {tabKey === EVENT_HISTORY ? <EventHistory {...this.props}/> : null }
                        </Tab> : null}
                    {checkRenderPermissions(permissions.CAN_SEE_CLAIMS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                        <Tab eventKey={CLAIM_HISTORY} title={CLAIM_HISTORY_TITLE}>
                            {tabKey === CLAIM_HISTORY ? <ClaimHistory {...this.props}/> : null}
                        </Tab> : null}
                </Tabs>
              
                
            </div>
        );
    }

}

export default PlayerHub;