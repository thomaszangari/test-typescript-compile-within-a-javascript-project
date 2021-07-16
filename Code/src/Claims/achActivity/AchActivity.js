import React from "react";
import {inject, observer} from "mobx-react";
import DatePicker from 'react-datepicker';
import './AchActivity.css';
import ReactTable from "../../PaginatedTable/ReactTable";
import AppTextbox from "../../AppTextbox";
import {Button} from "react-bootstrap";

@inject('playerStore', 'claimStore')
@observer
class AchActivity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            tableHeader: [],
            showToast: false,
            startDate: new Date(),
            endDate: new Date(),
            batch: '',
            rejectFileReference: '',
            isDisabled: true,
        }
    }

    componentDidMount() {
        this.props.claimStore.getAchData();
    }


    onClear = () => {

    }

    onSearchClick = (firstName = '', lastName = '', phone = '', email = '') => {

        // let queryParams = '?';
        // if (firstName && firstName !== '') {
        //     queryParams += `firstName=${firstName}`
        // }
        // if (lastName && lastName !== '') {
        //     if (queryParams.endsWith("?"))
        //         queryParams += `lastName=${lastName}`
        //     else
        //         queryParams += `&lastName=${lastName}`
        // }
        // if (phone && phone !== '') {
        //     if (queryParams.endsWith("?"))
        //         queryParams += `phone=${phone}`
        //     else
        //         queryParams += `&phone=${phone}`
        // }
        // if (email && email !== '') {
        //     if (queryParams.endsWith("?"))
        //         queryParams += `email=${email}`
        //     else
        //         queryParams += `&email=${email}`
        // }
        // this.props.playerStore.searchPlayers(queryParams);
    }

    setStartDate = (newDate) => {
        this.setState({startDate: newDate})
    }

    setEndDate = (newDate) => {
        this.setState({endDate: newDate})
    }

    handleInputChange = (e, stateName) => {
        this.setState({[stateName]: e.target.value});
    }

    renderPage() {
        const {tableHeader, tableRows} = this.props.claimStore;
        // const rows = tableRows && tableRows.map((d, index) => {
        //     d.idField = index + 1;
        //     // If the address2 field comes as null, then display empty string
        //     address2 = (d.address2 === null || d.address2.trim() === '') ? '' : `${d.address2},`;
        //     d.address = `${d.address1}, ${address2} ${d.city}, ${d.state}, ${d.zip5}`
        //     d.select =
        //         <a onClick={(e) => this.handleSelectClick(e, d.playerId)} href='' className='select-link'>Select</a>;
        //     return d;
        // });
        const {startDate, endDate, batch, rejectFileReference, isDisabled} = this.state;

        return (
            <div className='ach-activity-container container-fluid'>
                <div className='ach-activity-panel'>
                    <div className='ach-filter-section'>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label ach-date-label'>Start Date</div>
                            <DatePicker selected={startDate} onChange={date => this.setStartDate(date)} />
                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label ach-date-label'>End Date</div>
                            <DatePicker selected={endDate} onChange={date => this.setEndDate(date)} />
                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label'>Batch #</div>
                            <AppTextbox type='text' placeholder='Search Text' value={batch}
                                        onChange={(e) => this.handleInputChange(e, 'batch')}/>                        </div>
                        <div className='ach-flex-column'>
                            <div className='ach-input-label'>Reject File #</div>
                            <AppTextbox type='text' placeholder='Search Text' value={rejectFileReference}
                                        onChange={(e) => this.handleInputChange(e, 'rejectFileReference')}/>
                        </div>
                        <div className='ach-flex-column'>
                            <Button disabled={isDisabled} className='player-search-btn' onClick={() => this.onSearchClick()}>
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
                        ? <ReactTable tableHeader={tableHeader} rowData={tableRows} className='ach-update-user-table'/>
                        : null
                }
            </div>
        );

    }

    render() {
        let renderObj;
        if (true) {
            renderObj = this.renderPage();
        } else {
            renderObj =
                <h1 class='unauthorized-header'>You do not have permission to view this page! Please contact your System
                    Administrator!</h1>
        }

        return (
            renderObj
        );
    }

}

export default AchActivity;
