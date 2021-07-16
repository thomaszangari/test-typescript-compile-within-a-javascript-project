import React from "react";
import config from "../config";
import {Button, Form} from "react-bootstrap";
import './resetPasswordComponent.css';

class ResetPasswordComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {password: '', confirmPassword: '', username: null, token: null, isValidate: false};
    }

    componentDidMount() {
        if(this.props.match && this.props.match.params) {
            const {username, token} = this.props.match.params;
            this.setState({username: username, token: token});
        }
    }
    validatePasswordField = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
        return regex.test(password);
    }
    validateForm = () => {
        const {confirmPassword, password} = this.state;
        if(confirmPassword !== '' && password !== '' && confirmPassword === password) {
            const isValidPassword = this.validatePasswordField(password);
            const invalidPasswordMessage = 'A Password MUST contain at least 8 characters, at least 1 Uppercase alphabet, at least 1 lowercase alphabet, at least 1 number, and at least 1 special character (@,$,!,%,*,?,&)';
            this.setState({isValidate: isValidPassword, warningMessage: !isValidPassword ? invalidPasswordMessage : null})
        } else {
            this.setState({isValidate: false, warningMessage: null});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let {username, password, token} = this.state;
        password = Buffer.from(password).toString('base64')
        const data = {
            username,
            password,
            token
        }
        fetch(`${config.SERVER_BASE_URL}/v1/users/setpassword`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.setState({errorMessage: res.error});
                } else if (res && res.message) {
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({errorMessage: error.toString()});
            });
    }

    handleInputChange = (value, stateName) => {
        this.setState({[stateName]: value}, ()=>this.validateForm());
    }

    render() {
        const {errorMessage, confirmPassword, password, isValidate, warningMessage} = this.state;
        // const isValidate = this.validateForm();
        return (
            <div className="login App-header" >
                <div className='login-panel'>
                    <img src='/images/lottery_numbers_blue.png'/>
                    <Form onSubmit={(e) => this.handleSubmit(e)} className='login-form'>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                type="password"
                                placeholder="NEW PASSWORD"
                                autoFocus
                                value={password}
                                onChange={e => this.handleInputChange(e.target.value, 'password')}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                placeholder="CONFIRM PASSWORD"
                                onChange={e => this.handleInputChange(e.target.value, 'confirmPassword')}
                                value={confirmPassword}
                                type="password"
                            />

                            {errorMessage ?  <Form.Text className="app-error-message">{errorMessage}</Form.Text> : null}
                            {warningMessage ?  <Form.Text className="app-error-message">{warningMessage}</Form.Text> : null}
                        </Form.Group>


                        <Button
                            block
                            bsSize="large"
                            type="submit"
                            className='login-button'
                            disabled={!isValidate}
                        >
                            RESET PASSWORD
                        </Button>
                    </Form>



                </div>
            </div>
        );
    }
}

export default ResetPasswordComponent;
