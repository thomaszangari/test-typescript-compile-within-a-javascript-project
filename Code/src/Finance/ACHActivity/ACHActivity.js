import React from "react";
import {inject, observer} from "mobx-react";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {toJS} from "mobx";

import ReactTable from "../../PaginatedTable/ReactTable";
import AppTextbox from "../../AppTextbox";
import {Button} from "react-bootstrap";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";
import AppToast from "../../toast";

import './ACHActivity.css';

@inject('playerStore', 'claimStore')
@observer
class ACHActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            tableHeader: [],
            showToast: false,
            invalidBatchNumberError: ''
        }
    }

    componentDidMount() {
        // this.props.claimStore.clearTableData()
    }


    onClear = () => {
        this.props.claimStore.clearTableData()
        // this.setState({
        //     startDate: null,
        //     endDate: null   ,
        //     batch: '',
        //     rejectFileReference: ''
        // }, () => this.props.claimStore.clearTableData());
    }

    onSearchClick = () => {
        const {startDate, endDate, batchNumber, rejectFileReference} = this.props.claimStore;
        let queryParams = '?';
        if (startDate && endDate) {
            const sDate = moment(startDate).format('YYYY-MM-DD');
            const eDate = moment(endDate).format('YYYY-MM-DD');
            queryParams += `queryDateRangeStart=${sDate}&queryDateRangeEnd=${eDate}`;
        }
        if(batchNumber) {
            queryParams += `&batchNumber=${batchNumber.toString()}`;
        }
        if(rejectFileReference) {
            queryParams += `&rejectFileReferenceNumber=${rejectFileReference}`;
        }
        this.props.claimStore.getAchData(queryParams);

    }

    setStartDate = (newDate) => {
        if(newDate === null) {
            this.props.claimStore.setStartEndDate(null, null);
            // this.setState({endDate: null, startDate: null});
        } else {
            if(newDate > this.state.endDate) {
                this.setStartEndDate(newDate, null);
                // this.setState({startDate: newDate, endDate: null});
            } else {
                this.props.claimStore.setStartEndDate(newDate);
                this.setState({startDate: newDate});
            }
        }
    }

    setEndDate = (newDate) => {
        this.props.claimStore.setStartEndDate('', newDate);
        // this.setState({endDate: newDate})
    }

    handleInputChange = (e, stateName) => {
        if (stateName === 'batchNumber') {
            // const re = /^[0-9\b]+$/;
            // if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 7)) {
            if (e.target.value === '' ||  e.target.value.length <= 7) {
                const _batchNumber = e.target.value;
                const isError = _batchNumber.length > 0 && _batchNumber.length < 7;
                this.setState({
                    invalidBatchNumberError: isError ? 'Batch Number should be 7 characters' : ''
                }, () => this.props.claimStore.setBatchNumber(_batchNumber));
            }
        } else if(stateName === 'rejectFileReference') {
            this.props.claimStore.setRejectFileReference(e.target.value)
            // this.setState({[stateName]: e.target.value});
        }

    }

    viewDetailsClick = (data) => {
        if(data.batchnumber) {
            this.props.claimStore.setSelectedBatchId(data);
            this.props.history.push('/finance/claims/batch/details');
        } else {
            this.props.claimStore.setSelectedRejectReferenceNumber(data);
            this.props.history.push('/finance/claims/reject/details');
        }

    }

    renderACHActivity() {
        const {tableHeader, tableRows} = this.props.claimStore;
        const rows = toJS(JSON.parse(JSON.stringify(tableRows)));
        const headers = toJS(JSON.parse(JSON.stringify(tableHeader)));
        if(headers.length > 0 && rows.length > 0 &&
            checkRenderPermissions(permissions.CAN_SEE_BATCH_REJECT_FILE_DETAILS, JSON.parse(localStorage.getItem('userpolicies')))) {
            headers.push({key: 'view', label: ''});
            rows.forEach(row => {
                row.view = <a onClick={() => this.viewDetailsClick(row)} className='ach-link'>View</a>
            })
        }
        const { invalidBatchNumberError } = this.state;
        const {startDate, endDate, batchNumber, rejectFileReference} = this.props.claimStore;
        let isDisabled = true;
        if((startDate && endDate) || (batchNumber && batchNumber.length === 7) || rejectFileReference) {
            isDisabled = false;
        }
        return (
            <div className='ach-activity-container container-fluid'>
                <div className='ach-activity-panel player-search-child'>
                    <div className='ach-filter-section'>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label ach-date-label'>Start Date</div>
                            <DatePicker
                                selected={startDate}
                                isClearable
                                maxDate={new Date()}
                                onChange={date => this.setStartDate(date)}
                            />
                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label ach-date-label'>End Date</div>
                            <DatePicker
                                isClearable
                                selected={endDate}
                                disabled={!startDate}
                                minDate={startDate}
                                maxDate={new Date()}
                                onChange={date => this.setEndDate(date)}
                            />
                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label'>Batch #</div>
                            <AppTextbox type='text' value={batchNumber}
                                        onChange={(e) => this.handleInputChange(e, 'batchNumber')}/>
                            {invalidBatchNumberError ? <div className='ach-error-message'>{invalidBatchNumberError}</div>: null}
                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label'>Reject File Ref#</div>
                            <AppTextbox type='text' value={rejectFileReference}
                                        onChange={(e) => this.handleInputChange(e, 'rejectFileReference')}/>
                        </div>
                        <div className='ach-flex-column'>
                            <Button disabled={isDisabled || invalidBatchNumberError !== ''} className='player-search-btn' onClick={() => this.onSearchClick()}>
                                Search
                            </Button>
                            <Button className='player-search-btn' onClick={() => this.onClear()}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
                {
                    tableHeader && tableHeader.length > 0
                        ? <ReactTable tableHeader={headers} rowData={rows} className='ach-update-user-table'/>
                        : null
                }
            </div>
        );

    }

    render() {
        let renderObj;
        if (checkRenderPermissions(permissions.CAN_SEE_ACH_ACTIVITY, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderACHActivity();
        } else {
            renderObj =
                <h3 class='unauthorized-header'>You do not have permission to view this page! Please contact your System
                    Administrator!</h3>
        }

        return (
            renderObj
        );
    }

}

export default ACHActivity;
