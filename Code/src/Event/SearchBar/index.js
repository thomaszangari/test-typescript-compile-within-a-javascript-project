import React from "react";
import {Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import './EventSearch.css';
import {inject, observer} from "mobx-react";

@inject('playerStore')
@observer
class EventSearch extends React.Component {

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
        this.onNewSearch();
    }

    handleInputChange = (e, stateName) => {
        this.setState({[stateName]: e.target.value});
    }

    handleSelectChange = (e, stateName) => {
        const val = e.target.value;
        if (stateName === 'clientOs') {
            this.props.playerStore.setSelectedDeviceType(val)
        } else if (stateName === 'authEvent') {
            this.props.playerStore.setSelectedEvent(val);
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
        this.props.playerStore.ClearEventHistoryFilters();
    }

    onNewSearchCallback = () => {
        this.props.playerStore.clearEventHistorySearchResults()
        this.props.playerStore.setEventHistorySearchMode(true)
    }

    onNewSearch = () => {
        this.setState({
            startDate: '',
            endDate: ''
        }, () => this.onNewSearchCallback());
    }

    render() {

        const {startDate, endDate} = this.state;
        const {allDeviceTypes, allEvents, selectedDeviceType, selectedEvent, isEventHistoryInSearchMode} = this.props.playerStore;

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
                                    disabled={!isEventHistoryInSearchMode}
                                    selected={startDate}
                                    maxDate={endDate || new Date()}
                                    onChange={selected => this.setState({startDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='ticket-search-label'>End Date</div>
                        <DatePicker popperPlacement="bottom-end"
                                    disabled={!isEventHistoryInSearchMode}
                                    selected={endDate}
                                    minDate={startDate}
                                    maxDate={new Date()}
                                    onChange={selected => this.setState({endDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='ticket-search-label'>Device Type</div>
                        <select disabled={isEventHistoryInSearchMode} value={selectedDeviceType}
                                onChange={(e) => this.handleSelectChange(e, 'clientOs')}>
                            {
                                allDeviceTypes.map(identifier => {
                                    return <option value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='ticket-search-label'>Event</div>
                        <select disabled={isEventHistoryInSearchMode} value={selectedEvent}
                                onChange={(e) => this.handleSelectChange(e, 'authEvent')}>
                            {
                                allEvents.map(identifier => {
                                    return <option value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        {isEventHistoryInSearchMode ?
                            <Button disabled={isDisabled} className='ticket-search-btn' onClick={() => this.onSearch()}>
                                Search
                            </Button> :
                            <Button disabled={isDisabled} className='ticket-search-btn' onClick={() => this.onFilter()}>
                                Filter
                            </Button>
                        }
                        <Button className='ticket-search-btn' disabled={isEventHistoryInSearchMode} onClick={() => this.onClearFilters()}>
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

export default EventSearch;

