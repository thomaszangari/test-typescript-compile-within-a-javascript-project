import React from "react";
import PropTypes from 'prop-types';

import Header from "../Header/header";
import Sidebar from "../Sidebar";
import './AuthLayoutHOC.css';
import BackArrow from "../components/Icons/backArrow";


const MiscLayoutHOC = (WrappedComponent) => {

    class HOC extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                showBackConfirm: false,
            }
        }

        onHomeButtonClick = () => {
            this.props.history.push('/dashboard');
        }

        onBackButtonClick = () => {
            this.props.history.goBack();
        }

        render() {
            const customWidth = `${window.outerWidth - 255}px`;
            const customStyle = {width: customWidth}
            const {showBackConfirm} = this.state;
            return (
                <div className='auth-app'>
                    <Header/>
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
                           {/* <div className='page-title'>
                                <h2 className='title-text'>{this.props.title || 'Title'}</h2>
                            </div>*/}
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
            );
        }
    }

    return HOC;

};

MiscLayoutHOC.defaultProps = {
    showBackButton: true
}
MiscLayoutHOC.propTypes = {
    showBackButton: PropTypes.bool
}
export default MiscLayoutHOC;