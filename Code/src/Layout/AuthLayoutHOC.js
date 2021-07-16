import React from "react";
import PropTypes from 'prop-types';
import {Toast} from 'react-bootstrap';
import Header from "../Header/header";
import Sidebar from "../Sidebar";
import './AuthLayoutHOC.css';
import BackArrow from "../components/Icons/backArrow";
import {inject, observer} from "mobx-react";
import AppToast from "../toast";
import Spinner from "../Spinner";
import config from "../config";


const AuthLayoutHOC = (WrappedComponent) => {

    @inject('playerStore', 'claimStore', 'authStore', 'miscellaneousStore')
    @observer
    class HOC extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                isUpdate: false,
                showBackConfirm: false,
            }
        }

        onBackButtonClick = () => {
            if (this.state.isUpdate) {
                this.setState({showBackConfirm: true});
            } else {
                this.props.playerStore.clearTicketHistorySearchResults()
                this.props.playerStore.clearUserAuditActionSearchResults()
                this.props.playerStore.clearEventHistorySearchResults()
                this.props.history.goBack();
            }
        }

        onHomeButtonClick = () => {
            this.props.history.push('/dashboard');
        }
        handleUpdate = (flag) => {
            this.setState({isUpdate: flag});
        }

        handlePopup = (flag) => {
            flag ? this.props.history.goBack() : this.setState({showBackConfirm: false});
        }

        handleToastClose = () => {
            this.props.playerStore.setToastErrorSuccessMessage(false, '', '');
            this.props.claimStore.resetToast();
        }
        toggleCronJobToast = (details) => {
            this.props.miscellaneousStore.toggleNotification(details)
        }
        handleDetailViewClick = (event, details) => {
            alert('Details page under construction');
        }

        render() {
            const customWidth = `${window.outerWidth - 255}px`;
            const customStyle = {width: customWidth}
            const {showBackConfirm} = this.state;
            const {showMainToast, mainErrorMessage, mainSuccessMessage, isSpinnerLoading} = this.props.playerStore;
            const {isLoading, selectedBatchId, selectedRejectReferenceNumber, showToast, errorMessage, successMessage} = this.props.claimStore;
            const {showNotificationToast, notificationErrorList} = this.props.miscellaneousStore;
            let title = this.props.title || 'Title'
            if (this.props.history.location.pathname.startsWith('/player/hub')) {
                title = this.props.playerStore.titleText || 'Title';
            } else if (this.props.history.location.pathname.startsWith('/user/audit')) {
                title = this.props.playerStore.UserNameTitleText || 'Title';
            } else if (this.props.history.location.pathname.startsWith(`/claim/${this.props.playerStore.selectedClaimId}/paymenthistory`)) {
                title = `Transaction ${this.props.playerStore.paymentDetails.transactionId}`;
            } else if (this.props.history.location.pathname.startsWith(`/claim/${this.props.playerStore.selectedClaimId}`)) {
                title = `Claim ${this.props.playerStore.selectedClaimId}`;
            } else if (this.props.history.location.pathname.startsWith('/finance/claims/batch/details')) {
                title = `Batch ${selectedBatchId}`;
            } else if (this.props.history.location.pathname.startsWith('/finance/claims/reject/details')) {
                title = `Reject File ${selectedRejectReferenceNumber}`;
            }
            return (
                <div className='auth-app'>
                    <Header/>
                    {isSpinnerLoading || isLoading ? <Spinner /> : null}
                    {notificationErrorList && notificationErrorList.length
                        ? <div
                            className='cron-job-toast'
                        >
                            {
                                notificationErrorList.map((item, index) => {
                                    return <Toast show={showNotificationToast} onClose={() => this.toggleCronJobToast(item)} key={index}>
                                        <Toast.Header>
                                            <strong className="mr-auto">{item.title}</strong>
                                        </Toast.Header>
                                        <Toast.Body>
                                            <div>{item.errorMessage}</div>
                                            <a onClick={(e) => this.handleDetailViewClick(e, item)} href='javascript:void(0)'>Click here for more details</a>
                                        </Toast.Body>
                                    </Toast>
                                })
                            }

                        </div>
                        : null
                    }
                    <div className='auth-app-sidebar'>
                        <div className='auth-app-sidebar-wrapper'>
                            <div className='home-button'>
                                <div className="home-button-header"/*onClick={() => this.toggleList()}*/>
                                    <div className="dd-header-title">
                                        <img src='/icons/home-Icon.svg' onClick={() => this.onHomeButtonClick()}/>
                                        <div className='dd-label' onClick={() => this.onHomeButtonClick()}>Home</div>
                                        {/*{listOpen*/}
                                        {/*    ? <FaAngleUp />*/}
                                        {/*    : <FaAngleDown />*/}
                                        {/*}*/}
                                    </div>
                                </div>

                            </div>
                            <Sidebar {...this.props} />
                            <div className="vertical-separator"/>
                        </div>
                    </div>
                    <div className='auth-app-center-panel'>
                        <div className='app-center-panel-wrapper'>
                            {showMainToast ?
                                <AppToast showToast={showMainToast}
                                         message={mainSuccessMessage ? mainSuccessMessage : mainErrorMessage}
                                         isSuccessMessage={mainSuccessMessage !== null}
                                         handleClose={() => this.handleToastClose()}/> : null}
                             {showToast ?
                                <AppToast showToast={showToast}
                                         message={successMessage ? successMessage : errorMessage}
                                         isSuccessMessage={successMessage !== null}
                                         handleClose={() => this.handleToastClose()}/> : null}
                            <div className='page-title'>
                                <h2 className='title-text'>{title}</h2>
                            </div>
                            <div className='page-info-bar'>
                                {
                                    this.props.showBackButton
                                        ? <div className='back-arrow'>
                                            <BackArrow color='#FFFFFF' onClick={() => this.onBackButtonClick()}/>
                                        </div>
                                        : null
                                }
                            </div>
                            <WrappedComponent showBackConfirm={showBackConfirm} handlePopup={this.handlePopup}
                                              onUpdate={this.handleUpdate} {...this.props}/>
                        </div>
                    </div>
                </div>
            )
                ;
        }
    }

    return HOC;

};

AuthLayoutHOC.defaultProps = {
    showBackButton: true
}
AuthLayoutHOC.propTypes = {
    showBackButton: PropTypes.bool
}
export default AuthLayoutHOC;