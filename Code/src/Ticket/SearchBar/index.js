import React from "react";
import {Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import './TicketSearch.css';
import {inject, observer} from "mobx-react";

@inject('playerStore')
@observer
class TicketSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: '',
            endDate: ''
        }
    }

    componentDidMount() {
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 31)
        this.setState({startDate: startDate, endDate: new Date()})
    }

    handleInputChange = (e, stateName) => {
        this.setState({[stateName]: e.target.value});
    }

    handleSelectChange = (e, stateName) => {
        const val = e.target.value;
        if (stateName === 'game') {
            this.props.playerStore.setSelectedGameType(val)
        } else if (stateName === 'winStatus') {
            this.props.playerStore.setSelectedWinStatus(val);
        } else if (stateName === 'status') {
            this.props.playerStore.setSelectedStatus(val);
        }
    }

    onSearch = () => {
        const {startDate, endDate} = this.state;
        this.props.handleSearchClick(startDate, endDate);
    }

    onFilter = () => {
        this.props.handleFilterClick();
    }

    onClearFilters = () => {
        this.props.playerStore.ClearTicketHistoryFilters();
    }

    onNewSearchCallback = () => {
        this.props.playerStore.clearTicketHistorySearchResults()
        this.props.playerStore.setTicketHistorySearchMode(true)
    }

    onNewSearch = () => {
        this.setState({
            startDate: '',
            endDate: ''
        }, () => this.onNewSearchCallback());
    }

    render() {

        const {startDate, endDate} = this.state;
        const {allGameTypes, allWinStatuses, allStatuses, selectedGameType, selectedWinStatus, selectedStatus, isTicketHistoryInSearchMode} = this.props.playerStore;

        let isDisabled = true;

        if ((startDate && endDate)) {
            isDisabled = false
        }

        return (
            <>
                <div className='search-criteria'>
                    <div>
                        <div className='ticket-search-label'>Start Date</div>
                        <DatePicker popperPlacement="bottom-end"
                                    disabled={!isTicketHistoryInSearchMode}
                                    selected={startDate}
                                    maxDate={endDate || new Date()}
                                    onChange={selected => this.setState({startDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='ticket-search-label'>End Date</div>
                        <DatePicker popperPlacement="bottom-end"
                                    disabled={!isTicketHistoryInSearchMode}
                                    selected={endDate}
                                    minDate={startDate}
                                    maxDate={new Date()}
                                    onChange={selected => this.setState({endDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='ticket-search-label'>Game</div>
                        <select disabled={isTicketHistoryInSearchMode} value={selectedGameType}
                                onChange={(e) => this.handleSelectChange(e, 'game')}>
                            {
                                allGameTypes.map(identifier => {
                                    return <option value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='ticket-search-label'>Win Status</div>
                        <select disabled={isTicketHistoryInSearchMode} value={selectedWinStatus}
                                onChange={(e) => this.handleSelectChange(e, 'winStatus')}>
                            {
                                allWinStatuses.map(identifier => {
                                    return <option value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='ticket-search-label'>Approval Status</div>
                        <select disabled={isTicketHistoryInSearchMode} value={selectedStatus}
                                onChange={(e) => this.handleSelectChange(e, 'status')}>
                            {
                                allStatuses.map(identifier => {
                                    return <option value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        {isTicketHistoryInSearchMode ?
                            <Button disabled={isDisabled} className='ticket-search-btn' onClick={() => this.onSearch()}>
                                Search
                            </Button> :
                            <Button disabled={isDisabled} className='ticket-search-btn' onClick={() => this.onFilter()}>
                                Filter
                            </Button>
                        }
                        <Button className='ticket-search-btn' disabled={isTicketHistoryInSearchMode} onClick={() => this.onClearFilters()}>
                            Clear Filters
                        </Button>
                        <Button className='ticket-search-btn' onClick={() => this.onNewSearch()}>
                            New Search
                        </Button>
                    </div>
                </div>
            </>
        );
    }

}

export default TicketSearch;

