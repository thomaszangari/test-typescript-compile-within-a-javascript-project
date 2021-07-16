import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import CustomCard from '../dashboard/customCard';
import Widget from '../components/widget/widget';
import config from "../config";
import {Line} from 'react-chartjs-2';
import moment from "moment";
import {categories} from "../Constants/SystemDashCategories";

import './SystemDashboard.css';

class SystemDashboard extends React.Component {

    optionsHour = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'hour'
                },
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            }
        }
    }

    optionsDay = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                },
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    zeroLineColor: 'rgb(255, 255, 255, 0.2',
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            },
            ticks: {
                fontColor: "white",
                fontSize: 14,
            }
        }
    }

    optionsWeek = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'week'
                },
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: "white",
                    fontSize: 14,
                },
                gridLines: {
                    zeroLineColor: 'rgb(255, 255, 255, 0.2',
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            }
        }
    }

    optionUptime = {
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            }
        }
    }

    uptimeData = {
        labels: [
            'Up Time',
            'Down Time'
        ],
        datasets: [{
            data: [95, 5],
            backgroundColor: [
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#36A2EB',
                '#FFCE56'
            ]
        }]
    };

    playerData = {
        datasets: [
            {
                label: 'EVENTS',
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            }
        ]
    }

    infrastructureData = {
        datasets: [
            {
                label: 'EVENTS',
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            }
        ]
    }

    playerLabel = 'player';
    infrastructureLabel = 'infrastructure';

    constructor(props) {
        super(props);
        this.state = {
            environemnt: 0,
            apiErrors: 0,
            errors: 0,
            accepted: 0,
            nonrtc: 0,
            regAccepted: 0,
            regRejected: 0,
            playerData: this.playerData,
            infrastructureData: this.infrastructureData,
            queryStr: '',
            winner: 0,
            nonWinner: 0,
            ticketScanVelocity: 0
        }
    }

    componentDidMount() {
        this.setHours();
    }

    fetchSystemDetails = (length) => {
        var address = `${config.LOG_SERVER_BASE_URL}/v1/log/events`;
        //debugger;
        if (length == 'hours') {
            /*var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = '.' + yyyy + '.' + mm + '.' + dd;
            address = `${config.LOG_SERVER_BASE_URL}/v1/log/dayevents?date=${today}`;*/
            address = `${config.LOG_SERVER_BASE_URL}/v1/log/hoursevents?hours=24`;
        }
        if (length == 'days') {
            address = `${config.LOG_SERVER_BASE_URL}/v1/log/hoursevents?hours=168`;
        }
        if (!length || length == 'weeks') {
            address = `${config.LOG_SERVER_BASE_URL}/v1/log/hoursevents?hours=720`;
        }

        fetch(address, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.setState({errorMessage: res.error});
                } else {
                    this.setSystemDetails(res);
                }
            })
            .catch((error) => {
                this.setState({errorMessage: error.toString()});
            });
    }

    setSystemDetails = (res) => {
        let environemnt = 0;
        let apiErrors = 0;
        let errors = 0;
        let winner = 0;
        let nonrtc = 0;
        let regAccepted = 0;
        let regRejected = 0;
        let nonWinner = 0;
        let ticketScanVelocity = 0;

        res.hits.hits.forEach((hit) => {
            //console.log(hit);
            //debugger;
            if (hit._source.category === categories.ERROR) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.infrastructureLabel)
                errors++;
            }
            if (hit._source.category === categories.API_ERROR) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.infrastructureLabel)
                apiErrors++;
            }
            if (hit._source.category === categories.WINNER) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                winner++;
            }
            if (hit._source.category === categories.NON_WINNER) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                nonWinner++;
            }
            if (hit._source.category === categories.NON_RTC) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                nonrtc++;
            }
            if (hit._source.category === categories.ENVIRONMENT) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.infrastructureLabel)
                environemnt++;
            }
            if (hit._source.category === categories.KYC_ACCEPTED) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                regAccepted++;
            }
            if (hit._source.category === categories.KYC_REJECTED) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                regRejected++;
            }
            if (hit._source.category === categories.TICKET_SCAN_VELOCITY) {
                this.incDataSetValues(hit._source.eventDateTimeUTC, this.playerLabel)
                ticketScanVelocity++;
            }
        });

        this.setState(
            {
                environemnt: environemnt,
                apiErrors: apiErrors,
                errors: errors,
                winner: winner,
                nonWinner: nonWinner,
                nonrtc: nonrtc,
                regAccepted: regAccepted,
                regRejected: regRejected,
                playerData: this.playerData,
                infrastructureData: this.infrastructureData,
                ticketScanVelocity: ticketScanVelocity
            }
        )
    }

    navigateTo = (path, query) => {
        if (query != '') {
            this.props.history.push({pathname: path, state: {detail: query}});
        } else {
            this.props.history.push(path);
        }
    }

    incDataSetValues(datetime, graph) {
        var date = new Date(datetime);
        if (graph == 'player') {
            for (var i = 0; i < this.playerData.datasets[0].data.length; i++) {
                //var storedDate = this.playerData.datasets[0].data[i].y;
                if (date.getTime() > this.playerData.datasets[0].data[i].x.getTime()) {
                    if (i == this.playerData.datasets[0].data.length - 1) {
                        this.playerData.datasets[0].data[i].y++;
                    } else {
                        if (date.getTime() < this.playerData.datasets[0].data[i + 1].x.getTime()) {
                            this.playerData.datasets[0].data[i].y++;
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < this.infrastructureData.datasets[0].data.length; i++) {
                if (date.getTime() > this.infrastructureData.datasets[0].data[i].x.getTime()) {
                    if (i == this.infrastructureData.datasets[0].data.length - 1) {
                        this.infrastructureData.datasets[0].data[i].y++;
                    } else {
                        if (date.getTime() < this.infrastructureData.datasets[0].data[i + 1].x.getTime()) {
                            this.infrastructureData.datasets[0].data[i].y++;
                        }
                    }
                }
            }
        }
    }

    //Assigned length datetimes inc hours apart to the datasets for the graphs
    getTimeLabels(length, inc) {
        this.playerData.datasets[0].data = [];
        this.infrastructureData.datasets[0].data = [];

        var ts = new Date().getTime();

        for (var i = 0; i < length; i++) {

            var date = new Date(ts);

            var dateDataPlayer = {
                x: date,
                y: 0
            }

            var dateDataInfrastructure = {
                x: date,
                y: 0
            }

            this.playerData.datasets[0].data.unshift(dateDataPlayer);
            this.infrastructureData.datasets[0].data.unshift(dateDataInfrastructure);

            ts = ts - (inc * 60 * 60 * 1000);
        }
        //console.log(this.playerData);
        //console.log(this.infrastructureData);
    }

    setHours = () => {
        //debugger;
        var start = moment().subtract(1, 'day');
        var end = moment();
        var startDate = start.utc().format();
        var endDate = end.utc().format();

        this.setState({'queryStr': `?startDate=${startDate}&endDate=${endDate}&category=`});

        this.getTimeLabels(24, 1);
        this.fetchSystemDetails('hours');

        this.setState({'playerData': this.playerData});
        this.setState({'playerOptions': this.optionsHour});

        this.setState({'infrastructureData': this.infrastructureData});
        this.setState({'infrastructureOptions': this.optionsHour});
    }

    setDays = () => {
        var start = moment().subtract(7, 'days');
        var end = moment();
        var startDate = start.utc().format();
        var endDate = end.utc().format();

        this.setState({'queryStr': `?startDate=${startDate}&endDate=${endDate}&category=`});
        this.getTimeLabels(15, 12);
        this.fetchSystemDetails('days');

        this.setState({'playerData': this.playerData});
        this.setState({'playerOptions': this.optionsDay});

        this.setState({'infrastructureData': this.infrastructureData});
        this.setState({'infrastructureOptions': this.optionsDay});
    }

    setWeeks = () => {
        var start = moment().subtract(30, 'days');
        var end = moment();
        var startDate = start.utc().format();
        var endDate = end.utc().format();

        this.setState({'queryStr': `?startDate=${startDate}&endDate=${endDate}&category=`});
        this.getTimeLabels(11, 72);
        this.fetchSystemDetails('weeks');

        this.setState({'playerData': this.playerData});
        this.setState({'playerOptions': this.optionsWeek});

        this.setState({'infrastructureData': this.infrastructureData});
        this.setState({'infrastructureOptions': this.optionsWeek});
    }

    render() {

        const {
            environemnt, apiErrors, errors, winner, nonrtc, regAccepted, regRejected, playerData, playerOptions, infrastructureData,
            infrastructureOptions, upTime, queryStr, nonWinner, ticketScanVelocity
        } = this.state;

        return (
            <div className='system-dashboard-container'>
                <div className='system-dashboard-widget-container'>
                    <div className='c1r1'>
                        <Widget
                            value={winner}
                            title='WINNER: RTC'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('winner'))}
                            iconPath='/icons/communications-icon.svg'
                        />
                    </div>
                    <div className='c2r1'>
                        <Widget
                            value={nonrtc}
                            title='WINNER: NON-RTC'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat(categories.NON_RTC))}
                            iconPath='/icons/crashes-icon.svg'
                        />
                    </div>
                    <div className='c3r1'>
                        <Widget
                            value={nonWinner}
                            title='NON-WINNER'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('non-winner'))}
                            iconPath='/icons/crashes-icon.svg'
                        />
                    </div>
                    <div className='c4r1'>
                        <Widget
                            value={regAccepted}
                            title='KYC-ACCEPTED'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('kyc-accepted'))}
                            iconPath='/icons/communications-icon.svg'
                        />
                    </div>
                    <div className='c1r2'>
                        <Widget
                            value={regRejected}
                            title='KYC-REJECTED'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('kyc-rejected'))}
                            iconPath='/icons/crashes-icon.svg'
                        />
                    </div>
                    <div className='c2r2'>
                        <Widget
                            value={ticketScanVelocity}
                            title='TICKET-SCAN-VELOCITY'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat(categories.TICKET_SCAN_VELOCITY))}
                            iconPath='/icons/crashes-icon.svg'
                        />
                    </div>
                    <h5 className='container-title'>Player</h5>
                </div>
                <div className='system-dashboard-widget-container'>
                    <div className='c1r1'>
                        <Widget
                            value={environemnt}
                            title='ENVIRONMENT'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('environment'))}
                            iconPath='/icons/running-services-icon.svg'
                        />
                    </div>
                    <div className='c2r1'>
                        <Widget
                            value={apiErrors}
                            title='API ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('api-error'))}
                            iconPath='/icons/service-errors-icon.svg'
                        />
                    </div>
                    <div className='c3r1'>
                        <Widget
                            value={errors}
                            title='ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', queryStr.concat('error'))}
                            iconPath='/icons/IGT-errors-icon.svg'
                        />
                    </div>
                    <h5 className='container-title'>Infrastructure</h5>
                </div>
                <div className='system-dashboard-graph-container'>
                    <div className='graphs-window'>
                        <div className='system-dashboard-graph-mobile'>
                            <h6 className='graph-title'>Player Alerts</h6>
                            <Line data={playerData}
                                  options={playerOptions} redraw/>
                        </div>
                        <div className='system-dashboard-graph-infrastructure'>
                            <h6 className='graph-title'>Infrastructure Alerts</h6>
                            <Line data={infrastructureData}
                                  options={infrastructureOptions} redraw/>
                        </div>
                    </div>
                    <div className='cards-window'>
                        <CustomCard
                            title='Today'
                            handleCallback={() => this.setHours()}
                        />
                        <CustomCard
                            title='Last 7 Days'
                            handleCallback={() => this.setDays()}
                        />
                        <CustomCard
                            title='Last 30 Days'
                            handleCallback={() => this.setWeeks()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

/*
<div className='c3r1'>   
                        <Widget
                            value={appErrors}
                            title='APP ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', 'appErrors')}                        
                            iconPath='/icons/app-errors-icon.svg'
                            />  
                    </div>
                    <div className='c4r1'>    
                        <Widget
                            value={loginErrors}
                            title='LOGIN ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', 'loginErrors')}                        
                            iconPath='/icons/login-error-icon.svg'
                            />  
                    </div>
                    <div className='c1r2'>
                        <Widget
                            value={verification}
                            title='VERIFICATION SERVICE'
                            handleCallback={() => this.navigateTo('/system/stats', 'verification')}                        
                            iconPath='/icons/verification-icon.svg'
                            />  
                    </div>
                    <div className='c5'>
                        <Widget
                                value={loggedin}
                                title='LOGGED IN PLAYERS'
                                handleCallback={() => this.navigateTo('/system/stats', 'loggedin')}                        
                                iconPath='/icons/player_icon.svg'
                                />
                    </div>

<div className='c4r1'>    
                        <Widget
                            value={cognitoErrors}
                            title='COGNITO ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', 'cognitoErrors')}                        
                            iconPath='/icons/cognito-error-icon.svg'
                            />  
                    </div>
                    <div className='c1r2'>
                        <Widget
                            value={containers}
                            title='CONTAINERS'
                            handleCallback={() => this.navigateTo('/system/stats', 'containers')}                        
                            iconPath='/icons/containers-icon.svg'
                            />  
                    </div>
                    <div className='c2r2'>
                        <Widget
                            value={containerErrors}
                            title='CONTAINER ERRORS'
                            handleCallback={() => this.navigateTo('/system/stats', 'containerErrors')}                        
                            iconPath='/icons/container-error-icon.svg'
                            />  
                    </div>
                    <div className='c5'>
                        <div className='uptime-container'>
                            <Doughnut data={this.uptimeData}
                                        options={this.optionUptime}/>
                        </div>
                    </div>
*/

export default SystemDashboard;