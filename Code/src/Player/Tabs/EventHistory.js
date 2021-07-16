import React from "react";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import EventSearch from "../../Event/SearchBar";
import moment from "moment";
import ReactTable from "../../PaginatedTable/ReactTable";

@inject('playerStore')
@observer
class EventHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventHistoryList: [],
            tableHeader: [],
            showToast: false
        }
    }

/*    componentDidMount() {
        /!*let startDate = new Date();
        startDate.setDate(startDate.getDate() - 31)
        this.onSearchClick(startDate, new Date());*!/
    }*/

    onSearchClick = (queryDateRangeStart = '', queryDateRangeEnd = '') => {

        const startDate = new Date(queryDateRangeStart);
        const momentStartDate = moment(startDate).format();
        const endDate = new Date(queryDateRangeEnd);
        endDate.setHours(23, 59, 59);
        const momentEndDate = moment(endDate).format();
        
        let queryParams = '?';
        if (queryDateRangeStart && queryDateRangeStart !== '') {
            queryParams += `queryDateRangeStart=${momentStartDate}`
        }
        if (queryDateRangeEnd && queryDateRangeEnd !== '') {
            if (queryParams.endsWith("?"))
                queryParams += `queryDateRangeEnd=${momentEndDate}`
            else
                queryParams += `&queryDateRangeEnd=${momentEndDate}`
        }

        this.props.playerStore.searchEvents(queryParams);
    }

    onFilterClick = () => {
        this.props.playerStore.filterEventHistoryResult();
    }

    handleToastClose = () => {
        this.props.playerStore.setEventHistoryToast(false);
    }

    render() {

        const {eventHistoryTableHeader, eventHistoryTableRows, showEventHistoryToast, successMessage, errorMessage} = this.props.playerStore;
        let Timestamp;
        let rows = eventHistoryTableRows && eventHistoryTableRows.map((d, index) => {
            d.idField = index + 1;
            Timestamp = `${d.eventTimestamp}`
            d.date = Timestamp.substring(0, 10)
            d.time = Timestamp.substring(11, 19)
            return d;
        });
        return (
            <div className='player-search-container container-fluid'>
                <div className='player-search-panel player-search-child'>
                    <EventSearch tableHeader={eventHistoryTableHeader} userList={rows}
                                  handleSearchClick={this.onSearchClick} handleFilterClick={this.onFilterClick} {...this.props}/>
                </div>
                {
                    eventHistoryTableHeader && rows
                        ? <ReactTable tableHeader={eventHistoryTableHeader} rowData={rows}
                                          className='update-user-table'/>
                        : null
                }
                {/*{showEventHistoryToast
                    ?
                    <AppToast showToast={showEventHistoryToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }*/}
            </div>

        );

    }

}

export default EventHistory;
