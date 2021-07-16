import React from "react";
import {Button} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {Line} from 'react-chartjs-2';
import SystemSearch from '../systemsearch';
import ReactTable from "../PaginatedTable/ReactTable";
import AppToast from "../toast";
import config from "../config";
import moment from "moment";
import {ExportToCsv} from 'export-to-csv';

import './SystemDetails.css';

class SystemDetails extends React.Component {  

    constructor(props){
        super(props);
        this.state = {
            category: '',
            datetime: '',
            sourceFile: '',
            description: '',
            logLine: '',
            logContext: '',
            showError: false,
            showToast: false
        };
    }

    fetchSystemDetails(id = ''){
        if(id == ''){
            console.log('no query string passed');
        } else {
            var queryStr = `?id=${id}`;

            let url = `${config.LOG_SERVER_BASE_URL}/v1/log/eventbyid${queryStr}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
                })
                .then(response => response.json())
                .then(res => {
                    if (res.error) {
                        console.log(res.error);
                    } else {
                        this.setSystemDetails(res);
                    }
                })
                .catch((error) => {
                    this.setState({showError: true, errorMessage: error.toString()})
                });
        }
    }

    setSystemDetails = (res) => {
        var data = res.hits.hits;

        this.setState({
            'category': data[0]._source.category,
            'datetime': data[0]._source.eventDateTime,
            'sourceFile': data[0]._source.fileName,
            'description': data[0]._source.eventDescription,
            'logLine': data[0]._source.eventResult,
            'logContext': data[0]._source.context,
        });
    }

    componentDidMount() {
        var data = null;

        if (this.props.location.state == undefined){
            this.props.history.push('/system/dashboard');
        }
        else
        {
            var id = this.props.location.state.detail;
            this.fetchSystemDetails(id);
        }
    }

    downloadClicked(data) {
        this.csvExporter.generateCsv(data);
    }

    render() {
        const {category, datetime, sourceFile, description, logLine, logContext} = this.state;        

        return(
            <div className='system-details-panel'>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Category:</h4>
                    <p className='system-details-text'>{category}</p>
                </div>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Local Time:</h4>
                    <p className='system-details-text'>{datetime}</p>
                </div>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Source File:</h4>
                    <p className='system-details-text'>{sourceFile}</p>
                </div>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Description:</h4>
                    <p className='system-details-text'>{description}</p>
                </div>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Log Line:</h4>
                    <p className='system-details-text'>{logLine}</p>
                </div>
                <div className='system-details-rows'>
                    <h4 className='system-details-header'>Log Context:</h4>
                    <p className='system-details-text'>{logContext}</p>
                </div>
            </div>
        ) 
    }
}

export default SystemDetails;