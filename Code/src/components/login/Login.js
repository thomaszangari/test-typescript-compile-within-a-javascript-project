import React from 'react';
import {Button, Form} from "react-bootstrap";
import dotenv from 'dotenv'
import "./Login.css";
import {observer} from "mobx-react";

dotenv.config()

@observer
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {email: "", password: "", accessToken: null, refreshToken: null};
    }

    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {email, password} = this.state;
        this.props.authStore.loginWithPassword(email, password, this.props);
    }

    handleInputChange = (value, stateName) => {
        this.setState({[stateName]: value});
    }

    render() {
        const {email, password} = this.state;
        const {passwordAuthErrorMessage} = this.props.authStore;
        const isValidate = this.validateForm();
        return (
            <div className="login App-header">
                <div className='login-panel'>
                    <img src='/images/lottery_numbers_blue.png'/>
                    <Form onSubmit={this.handleSubmit} className='login-form'>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email Address"
                                autoFocus
                                value={email}
                                onChange={e => this.handleInputChange(e.target.value, 'email')}
                            />
                        </Form.Group>

                        <Form.Group coapp-error-messagentrolId="formBasicPassword">
                            <Form.Control
                                placeholder="Password"
                                onChange={e => this.handleInputChange(e.target.value, 'password')}
                                type="password"
                            />
                            {passwordAuthErrorMessage ? <Form.Text className="app-error-message">{passwordAuthErrorMessage}</Form.Text> : null}
                        </Form.Group>

                        <Button block bsSize="large" type="submit" className='login-button'>
                            Login
                        </Button>
                        {/*<div className='app-forgot-password'>*/}
                        {/*    <Link to="/forgotpassword" className="app-forgot-password-title">*/}
                        {/*        Forgot password?*/}
                        {/*    </Link>*/}
                        {/*</div>*/}
                    </Form>

                </div>
            </div>
        );
    }

}

export default Login;
