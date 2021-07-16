import React from "react";
import './MyToast.css'
import {Toast} from "react-bootstrap";

class MyToast extends React.Component {

    render() {
        const {showToast, message, isSuccessMessage, handleClose} = this.props;
        const className = isSuccessMessage ? 'success-msg' : 'error-msg'
        return (
            <div aria-live="polite" aria-atomic="true" className={`${className} my-toast`}>
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

export default MyToast;
