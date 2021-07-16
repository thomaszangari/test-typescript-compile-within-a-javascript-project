import React from "react";
import './AppToast.css'
import {Toast} from "react-bootstrap";

class AppToast extends React.Component {

    render() {
        const {showToast, message, isSuccessMessage, handleClose} = this.props;
        const className = isSuccessMessage ? 'success-message' : 'error-message'
        return (
            <div aria-live="polite" aria-atomic="true" className={`${className} custom-toast`}>
                <div>
                    <Toast onClose={() => handleClose()} show={showToast} delay={5000} autohide>
                        <Toast.Header>
                            <strong className="mr-auto">Message</strong>
                            <small>few seconds ago</small>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                </div>
            </div>
        )
    }
}

export default AppToast;
