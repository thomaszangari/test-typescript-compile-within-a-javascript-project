import React from "react";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import TicketSearch from "../../Ticket/SearchBar";
import {UserAction, UserActionCategory} from "../../UserActionCategory";
import moment from "moment";
import ReactTable from "../../PaginatedTable/ReactTable";

@inject('playerStore')
@observer
class TicketHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketHistoryList: [],
            tableHeader: []
        }
    }

    componentDidMount() {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 31)
        this.onSearchClick(startDate, new Date());
    }

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

        // Log User Action

        let criteria = `Start Date: ${momentStartDate} End Date: ${momentEndDate}`
        this.props.playerStore.logAction(UserActionCategory.API_CALL, UserAction.TICKET_HISTORY, '', criteria)

        this.props.playerStore.searchTickets(queryParams);
    }

    onFilterClick = () => {
        this.props.playerStore.filterTicketHistoryResult();
    }

    handleToastClose = () => {
        this.props.playerStore.setTicketHistoryToast(false);
    }

    render() {

        const {ticketHistoryTableHeader, ticketHistoryTableRows, showTicketHistoryToast, successMessage, errorMessage} = this.props.playerStore;
        let Timestamp;
        let rows = ticketHistoryTableRows && ticketHistoryTableRows.map((d, index) => {
            d.idField = index + 1;
            Timestamp = `${d.requestTimestamp}`
            d.date = Timestamp.substring(0, 10)
            d.time = Timestamp.substring(11, 19)
            d.amount = isNaN(`${d.prizeAmount}`) ? `${d.prizeAmount}` : (Number(`${d.prizeAmount}`) / 100).toFixed(2)
            return d;
        });

        return (
            <div className='player-search-container container-fluid'>
                <div className='player-search-panel player-search-child'>
                    <TicketSearch tableHeader={ticketHistoryTableHeader} userList={rows}
                                  handleSearchClick={this.onSearchClick}
                                  handleFilterClick={this.onFilterClick} {...this.props}/>
                </div>
                {
                    ticketHistoryTableHeader && rows
                        ? <ReactTable tableHeader={ticketHistoryTableHeader} rowData={rows}
                                          className='update-user-table'/>
                        : null
                }
                {/*{showTicketHistoryToast
                    ?
                    <AppToast showToast={showTicketHistoryToast}
                              message={successMessage ? successMessage : errorMessage}
                              isSuccessMessage={successMessage !== null}
                              handleClose={() => this.handleToastClose()}/>
                    : null
                }*/}
            </div>

        );

    }

}

export default TicketHistory;
