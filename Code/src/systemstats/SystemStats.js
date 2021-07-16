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

import './SystemStats.css';

class SystemStats extends React.Component {  

    data = {
        labels: [],
        datasets: [
          {
            label: 'Alerts',
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
        ],        
    }

    
    options = {
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
                    color: 'rgb(255, 255, 255, 0.2)'
                }
            }]
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            }
        },
        maintainAspectRatio: false
    }

    CSVoptions = {
        showLabels: true,
        useTextFile: false,
        useBom: true,
        //useKeysAsHeaders: true,
        headers: ['Time UTC', 'Time', 'Description', 'Context', 'Type', 'Details', 'Priority', 'Category', 'ID', '-']
    };

    constructor(props){
        super(props);
        this.state = {
            graphData: this.data,
            statsList: [],
            tableHeader: [{key: 'category', label: 'Category'},
                        {key: 'priority', label: 'Priority'},
                        {key: 'eventDateTime', label: 'Date'},
                        {key: 'eventType', label: 'Type'},
                        {key: 'eventDescription', label: 'Description'},
                        {key: 'details', label: 'Details'}],
            showToast: false
        }
    }

    csvExporter = new ExportToCsv(this.CSVoptions);

    incDataSetValues(datetime){
        var date = new Date(datetime);
            for (var i = 0; i < this.data.datasets[0].data.length; i++){
                //var storedDate = this.playerData.datasets[0].data[i].y;
                if (date.getTime() > this.data.datasets[0].data[i].x.getTime()){
                    if (i == this.data.datasets[0].data.length - 1){
                        this.data.datasets[0].data[i].y++;                    
                    } else{
                        if(date.getTime() < this.data.datasets[0].data[i + 1].x.getTime()){
                            this.data.datasets[0].data[i].y++;
                        }
                    }
                }
            }
        }

    populateDataSet(queryStr, segments = 12){

        var startStr = queryStr.substring(11, 31);
        var endStr = queryStr.substring(40, 60);
        var startMoment = moment(startStr);
        var endMoment = moment(endStr);
        var diffMS = endMoment.diff(startMoment);

        var diffSegment = Math.ceil(diffMS/segments);
        var ts = endMoment.valueOf();

        this.data.datasets[0].data = [];
        this.data.labels = [];

        for(var i = 0; i < segments; i++){
            var date = new Date(ts);

            var dateData = {
                x: date,
                y: 0
            }
            
            this.data.datasets[0].data.unshift(dateData);
            this.data.labels.unshift(date);

            ts = ts - (diffSegment);
        }
       }

    onSearchClick = (categorySelected = '', queryDateRangeStart = '', queryDateRangeEnd = '', querySearchText = '') => {
        var startDate = new Date(queryDateRangeStart);
        const momentStartDate = moment(startDate).utc().format();
        var endDate = new Date (queryDateRangeEnd);
        endDate.setHours(23, 59, 59);        
        const momentEndDate = moment(endDate).utc().format();

        var query = `?startDate=${momentStartDate}&endDate=${momentEndDate}&category=${categorySelected}&searchText=${querySearchText}`;

        this.fetchSystemDetails(query);
    }

    fetchSystemDetails(queryStr = ''){
        if(queryStr == ''){
            console.log('no query string passed');
        } else {
            
            this.populateDataSet(queryStr, 12);
            
            let url = `${config.LOG_SERVER_BASE_URL}/v1/log/stats${queryStr}`;
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

    handleSelectClick = (event, id) => {
        event.preventDefault();
        this.navigateTo('/system/details', id);
    }

    navigateTo = (path, id) => {
        if(id != ''){
            this.props.history.push({pathname: path, state: { detail: id }});
        }
        else{
            this.props.history.push(path);
        }
    }

    setSystemDetails = (res) => {
        var data = res.hits.hits;
        data.forEach((hit) => {
            this.incDataSetValues(hit._source.eventDateTimeUTC);
        });

        this.setState({'graphData': this.data});

        const rows = Object.values(data).map(d => {
            var temp = d._id;
            d = d._source;
            d._id = temp;
            d.details = <a onClick={(e) => this.handleSelectClick(e, d._id)} href='' className='select-link'>Details</a>;

            return d;
        });
        rows.forEach(element => element.eventDateTime = moment(element.eventDateTime).format());

        this.setState({'statsList': rows});
    }

    componentDidMount() {
        var data = null;

        if (this.props.location.state == undefined){
            this.props.history.push('/system/dashboard');
        }
        else
        {
            var query = this.props.location.state.detail;
            this.fetchSystemDetails(query);
        }
    }

    downloadClicked(data) {
        //debugger;
        //const {details, eventDateTime, tempData} = data;
        this.csvExporter.generateCsv(data);
    }

    render() {
        const {tableHeader, statsList, graphData, showToast} = this.state;        
        const msg = 'No Results found.';
        return(
            <div className='system-stats'>
                <div className='graph-container'>
                    <Line data={graphData}
                    options={this.options} redraw />
                </div>
                <div className='search-container'>
                    <SystemSearch handleSearchClick={this.onSearchClick}/>
                </div>
                <div className='table-container'>
                {
                    tableHeader && statsList
                        ? <ReactTable tableHeader={tableHeader} rowData={statsList} className='update-stats-table'/>
                        : null
                }
                </div>
                <div>
                    <Button className='system-search-btn'
                            onClick={() => this.downloadClicked(statsList)}>Export</Button>
                </div>
                {
                    showToast ? <AppToast showToast={showToast} message={msg} isSuccessMessage={true}
                                          handleClose={this.onToastClose}/> : null
                }
            </div>
        ) 
    }
}

export default SystemStats;