import React from "react";
import {UserAction, UserActionCategory} from "../UserActionCategory";
import './sidebar.css';
import dotenv from 'dotenv'
import {inject} from "mobx-react";
import {checkRenderPermissions} from "../helpers";
import {permissions} from "../constants";

dotenv.config()

@inject('playerStore', 'authStore')
class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAdminMenuOpen: false,
            isKnowledgeBaseMenuOpen: false
        }
    }

    navigateToHome = () => {
        localStorage.clear();
        this.props.history.push('/');
    }

    handleAdminMenuItemClick = (event, path) => {
        event.preventDefault();
        if (path === 'logout') {
            this.props.authStore.logout(this.props);
        } else {

            if (path === '/usermanagement')
                this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.USER_MANAGEMENT);
            else if (path === '/rolemanagement')
                this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.ROLE_MANAGEMENT);

            this.props.history.push(path);
        }

    }

    handleKnowledgeBaseMenuItemClick = (event, path) => {
        event.preventDefault();
        if (path === 'administratoruserguide') {
            this.toggleKnowledgeBaseMenu()
            this.props.playerStore.downloadPDF(path)
        } else if (path === 'playersupportuserguide') {
            this.toggleKnowledgeBaseMenu()
            this.props.playerStore.downloadPDF(path)
        } else if (path === 'androidappuserguide') {
            this.toggleKnowledgeBaseMenu()
            this.props.playerStore.downloadPDF(path)
        } else if (path === 'troubleshootingguide') {
            this.toggleKnowledgeBaseMenu()
            this.props.playerStore.downloadPDF(path)
        } else if (path === 'technicaldocumentation') {
            this.toggleKnowledgeBaseMenu()
            this.props.playerStore.downloadPDF(path)
        }
    }

    toggleAdminMenu = () => {
        this.setState(prevState => ({isAdminMenuOpen: !prevState.isAdminMenuOpen, isKnowledgeBaseMenuOpen: false}))
    }

    toggleKnowledgeBaseMenu = () => {
        this.setState(prevState => ({
            isKnowledgeBaseMenuOpen: !prevState.isKnowledgeBaseMenuOpen,
            isAdminMenuOpen: false
        }))
    }

    render() {
        const {isAdminMenuOpen, isKnowledgeBaseMenuOpen} = this.state
        return (
            <div className='sidebar-menu'>

                <div className="dd-wrapper">
                    <div className="dd-header" onClick={() => this.toggleAdminMenu()}>
                        <div className="dd-header-title">
                            <img src='/icons/admin.png'/>
                            <div className='dd-label'>Admin</div>
                        </div>
                    </div>
                    {
                        isAdminMenuOpen &&
                        <div className="dd-list">
                            {checkRenderPermissions(permissions.CAN_ACCESS_USER_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-item"
                                     onClick={event => this.handleAdminMenuItemClick(event, "/usermanagement")}>
                                    User Management
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_ACCESS_ROLE_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-item"
                                     onClick={event => this.handleAdminMenuItemClick(event, "/rolemanagement")}>
                                    Role Management
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_ACCESS_SETTINGS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-item"
                                     onClick={event => this.handleAdminMenuItemClick(event, "/admin/settings")}>
                                    Settings
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_ACCESS_USER_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies'))) ||
                            checkRenderPermissions(permissions.CAN_ACCESS_ROLE_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies'))) ||
                            checkRenderPermissions(permissions.CAN_ACCESS_SETTINGS, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <hr className='separator'/> : null}
                            <div className="dd-list-item"
                                 onClick={event => this.handleAdminMenuItemClick(event, "logout")}>
                                Logout
                            </div>
                        </div>
                    }
                    <div className="dd-header" onClick={() => this.toggleKnowledgeBaseMenu()}>
                        {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ADMINISTRATOR_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                        checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_PLAYER_SUPPORT_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                        checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ANDROID_APP_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                        checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TROUBLESHOOTING_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                        checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TECHNICAL_DOCUMENTATION, JSON.parse(localStorage.getItem('userpolicies'))) ?
                            <div className="dd-header-title">
                                <img src='/icons/knowledge-base.svg'/>
                                <div className='dd-label'>Knowledge Base</div>
                            </div> : null}
                    </div>
                    {
                        isKnowledgeBaseMenuOpen && <div className="dd-list">
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ADMINISTRATOR_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                            checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_PLAYER_SUPPORT_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                            checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ANDROID_APP_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-item-header" disabled>User Guides</div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ADMINISTRATOR_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-sub-item"
                                     onClick={event => this.handleKnowledgeBaseMenuItemClick(event, "administratoruserguide")}>
                                    Administrator User Guide
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_PLAYER_SUPPORT_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-sub-item"
                                     onClick={event => this.handleKnowledgeBaseMenuItemClick(event, "playersupportuserguide")}>
                                    Player Support User Guide
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_ANDROID_APP_USER_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-sub-item"
                                     onClick={event => this.handleKnowledgeBaseMenuItemClick(event, "androidappuserguide")}>
                                    Android App User Guide
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TROUBLESHOOTING_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ||
                            checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TECHNICAL_DOCUMENTATION, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-item-header" disabled>Other</div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TROUBLESHOOTING_GUIDE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-sub-item"
                                     onClick={event => this.handleKnowledgeBaseMenuItemClick(event, "troubleshootingguide")}>
                                    Troubleshooting Guide
                                </div> : null}
                            {checkRenderPermissions(permissions.CAN_VIEW_DOWNLOAD_TECHNICAL_DOCUMENTATION, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                <div className="dd-list-sub-item"
                                     onClick={event => this.handleKnowledgeBaseMenuItemClick(event, "technicaldocumentation")}>
                                    Technical Documentation
                                </div> : null}
                        </div>
                    }
                </div>
                <div className="img-wrapper">
                    <img src="/images/lottery_numbers_blue.png"></img>
                </div>
            </div>
        );
    }
}

export default Sidebar;