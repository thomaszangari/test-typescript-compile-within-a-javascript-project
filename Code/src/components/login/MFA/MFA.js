import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import dotenv from 'dotenv'
import "./MFA.css";
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";

dotenv.config()

@inject('authStore')
@observer
class MFA extends React.Component {

    constructor(props) {
        super(props);
        this.state = {TOTP: ""};
    }

    validateForm = () => {
        return this.state.TOTP.length == 6;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {TOTP} = this.state;
        this.props.authStore.loginWithTOTP(TOTP, this.props)
    }

    ResendOTP = () => {
        this.props.authStore.requestOTP();
    }

    handleInputChange = (value, stateName) => {

        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex
        if (value === '' || re.test(value)) {
            this.setState({[stateName]: value});
        }
    }

    render() {
        const {TOTP} = this.state;
        const {otpAuthErrorMessage} = this.props.authStore;
        const isValidate = this.validateForm();
        return (
            <div className="login App-header">
                <div className='login-panel'>
                    <img src='/images/lottery_numbers_blue.png'/>

                    <Form onSubmit={this.handleSubmit} className='login-form'>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                placeholder="One-Time Passcode"
                                maxLength='6'
                                autoFocus
                                value={TOTP}
                                onChange={e => this.handleInputChange(e.target.value, 'TOTP')}
                            />
                            {otpAuthErrorMessage ? <Form.Text className="app-error-message">{otpAuthErrorMessage}</Form.Text> : null}
                        </Form.Group>
                        <Row>
                            <Col>
                                <Button block bsSize="large" onClick={() => this.ResendOTP()}>
                                    Resend OTP
                                </Button>
                            </Col>
                            <Col>
                                <Button block bsSize="large" type="submit" disabled={!isValidate}>
                                    Verify
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                    <div className="back-to-login">
                        <div>
                            <Link className="link-color" to="/login">Back to Login Page</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default MFA;
