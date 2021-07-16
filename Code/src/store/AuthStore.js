import React from "react";
import {persist} from "mobx-persist";
import {action, observable} from "mobx";
import config from "../config";

export class AuthStore {

    rootStore = null;

    // Password Login
    @observable passwordAuthErrorMessage = null;
    @persist @observable accessToken = null;
    @persist @observable refreshToken = null;

    // OTP Verify
    @observable otpAuthErrorMessage = null;
    @persist @observable otpAccessToken = null;

    // User Details
    @persist @observable userId = null;
    @persist @observable userName = null;
    @persist @observable userFullName = null;
    @persist @observable userRole = null;
    @persist @observable userPolicies = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    makeWSConnection() {
        // Create WebSocket connection.
        let baseURL = (config.SERVER_BASE_URL).toString();
        if(baseURL.startsWith('https://')){
            baseURL = baseURL.replace("https://", "");
        } else if(baseURL.startsWith('http://')) {
            baseURL = baseURL.replace("http://", "");
        }
        const socket = new WebSocket(`wss://${baseURL}`);

        // Connection opened
        socket.addEventListener('open',  (event) => {
            socket.send('Hello Server!');
            console.log('WebSocket Connected');
        });

        // Listen for messages
        socket.addEventListener('message',  (event) => {
            console.log('Message from server', event.data);
            const details = JSON.parse(event.data);
            debugger;
            if(details && details.errorMessage) {
                this.props.miscellaneousStore.setFailedJobDetails(details);
            }
        });

        // Listen for possible errors
        socket.addEventListener('error',  (event) =>{
            console.log('Message from server ', event.data);
        });
    }

    postLogin(props) {
        this.getPolicies(props);
        this.makeWSConnection();
    }

    /**
     *
     * @param userName
     * @param password
     */
    @action loginWithPassword(email, password, props) {

        let data = {
            "username": email,
            "password": Buffer.from(password).toString('base64')
        }

        fetch(`${config.SERVER_BASE_URL}/v1/auth/login`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.passwordAuthErrorMessage = res.error;
                } else {

                    this.otpAuthErrorMessage = null;
                    this.passwordAuthErrorMessage = null;

                    const {accessToken, refreshToken, firstname, lastname, userid, OTPAccessToken} = res;
                    localStorage.setItem('userName', email);
                    if (accessToken !== undefined) {
                        //this.setState({errorMessage: 'Authentication successful', accessToken, refreshToken});
                        //this.passwordAuthErrorMessage = 'Authentication successful';
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('loggedInUserFullName', `${firstname} ${lastname}`);
                        localStorage.setItem('loggedInUserID', userid);

                        this.accessToken = accessToken;
                        this.refreshToken = refreshToken;
                        this.userId = userid;
                        this.userName = email;
                        this.userFullName = `${firstname} ${lastname}`
                        this.postLogin(props);

                    } else if (OTPAccessToken !== undefined) {
                        //this.setState({errorMessage: 'Authentication successful'});
                        //this.passwordAuthErrorMessage = 'Authentication successful';
                        localStorage.setItem('OTPAccessToken', OTPAccessToken);
                        this.otpAccessToken = OTPAccessToken;
                        this.userName = email;
                        props.history.push('/login/mfa');
                    }
                }
            })
            .catch((error) => {
                this.passwordAuthErrorMessage = error.toString();
            });

        /*data = {
            "username": email
        }

        fetch(`${config.SERVER_BASE_URL}/v1/users/querypolicies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    //this.setState({errorMessage: res.error});
                    this.passwordAuthErrorMessage = res.error;
                } else {
                    localStorage.setItem('userpolicies', JSON.stringify(res));
                }
            })
            .catch((error) => {
                console.log(error);
                //this.setState({errorMessage: error.toString()});
                this.passwordAuthErrorMessage = error.toString();
            });*/
    }

    /**
     *
     * @param userName
     * @param TOTP
     */
    @action loginWithTOTP(OTP, props) {

        let data = {
            "OTP": OTP
        }

        fetch(`${config.SERVER_BASE_URL}/v1/auth/login/mfa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getOTPAccessToken()}`
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.otpAuthErrorMessage = res.error;
                } else {

                    this.otpAuthErrorMessage = null;
                    this.passwordAuthErrorMessage = null;

                    const {accessToken, refreshToken, firstname, lastname, userid, userName} = res;
                    // this.setState({errorMessage: 'Authentication successful', accessToken, refreshToken});
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    //localStorage.setItem('userName', userName);
                    localStorage.setItem('loggedInUserFullName', `${firstname} ${lastname}`);
                    localStorage.setItem('loggedInUserID', userid);
                    //this.props.history.push('/dashboard', {userName: email});

                    this.accessToken = accessToken;
                    this.refreshToken = refreshToken;
                    this.userId = userid;
                    //this.userName = email;
                    this.userFullName = `${firstname} ${lastname}`
                    this.postLogin(props);

                }
            })
            .catch((error) => {
                this.otpAuthErrorMessage = error.toString();
            });
    }

    /**
     *
     */
    @action requestOTP() {

        const token = localStorage.getItem('OTPAccessToken');

        fetch(`${config.SERVER_BASE_URL}/v1/auth/otp`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.otpAuthErrorMessage = res.error;
                } else if (res && res.message) {
                    this.otpAuthErrorMessage = res.message;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    /**
     *
     */
    @action logout(props) {

        const token = this.getRefreshToken();
        const username = this.getUserName();
        const url = `${config.SERVER_BASE_URL}/v1/auth/logout`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, token: token}),
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    alert(res.error);
                } else {
                    //this.navigateToHome();
                    localStorage.clear();
                    props.history.push('/');
                }
            })
            .catch((error) => {
                alert('Error:', error);
            });
    }

    @action getPolicies(props) {

        const data = {
            "username": localStorage.getItem('userName')
        }

        fetch(`${config.SERVER_BASE_URL}/v1/users/querypolicies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    //this.setState({errorMessage: res.error});
                    this.passwordAuthErrorMessage = res.error;
                } else {
                    // props.history.push('/dashboard');
                    localStorage.setItem('userpolicies', JSON.stringify(res));
                    props.history.push('/dashboard', {userName: this.userName});
                }
            })
            .catch((error) => {
                console.log(error);
                //this.setState({errorMessage: error.toString()});
                this.passwordAuthErrorMessage = error.toString();
            });
    }

    @action getAccessToken() {
        return this.accessToken;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getOTPAccessToken() {
        return this.otpAccessToken;
    }

    getUserName() {
        return this.userName;
    }
}