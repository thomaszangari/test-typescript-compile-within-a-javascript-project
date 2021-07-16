import React from "react";
import DatePicker from "react-datepicker";
import {Button} from "react-bootstrap";
import {inject} from "mobx-react";
import {UserAction} from "../../UserActionCategory";

@inject('playerStore')
class AuditSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            action: 'Select',
            actionsList: ['Select', ...Object.values(UserAction)]
        }
    }

    handleInputChange = (e, stateName) => {
        this.setState({[stateName]: e.target.value});
    }

    handleSelectChange = (e) => {
        const val = (e.target.value);
        this.setState({action: val});
    }

    onSearch = () => {
        const {startDate, endDate, action} = this.state;
        this.props.playerStore.clearUserAuditActionSearchResults()
        this.props.handleSearchClick(startDate, endDate, action.value);
    }

    onClear = () => {
        this.setState({
            startDate: '',
            endDate: '',
            action: '',
        }, () => this.props.playerStore.clearUserAuditActionSearchResults());
    }

    onCancel = () => {
        this.setState({
            startDate: '',
            endDate: '',
            action: '',
        }, () => this.props.playerStore.clearUserAuditActionSearchResults());
        this.props.history.goBack();
    }

    render() {

        const {startDate, endDate, action, actionsList} = this.state;

        // Conditions to activate the [Filter]
        let isDisabled = true;
        if (startDate && endDate) {
            isDisabled = false
        }

        return (
            <div>
                <div className='search-criteria'>
                    <div>
                        <div className='claim-search-label'>Start Date</div>
                        <DatePicker maxDate={new Date()}
                                    isClearable={false}
                                    placeholderText="Start Date"
                                    selected={startDate}
                                    onChange={date => this.setState({startDate: date})}/>
                    </div>
                    <div>
                        <div className='claim-search-label'>End Date</div>
                        <DatePicker maxDate={new Date()}
                                    isClearable={false}
                                    placeholderText="End Date"
                                    selected={endDate}
                                    onChange={date => this.setState({endDate: date})}/>
                    </div>
                    <div>
                        <div className='claim-search-label'>Action</div>
                        <select value={action.id} onChange={this.handleSelectChange}>
                            {
                                actionsList.map((identifier, index) => {
                                    return <option key={index} value={identifier}>{identifier}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <Button disabled={isDisabled} className='claim-search-btn' onClick={() => this.onSearch()}>
                            Search
                        </Button>
                        <Button className='player-search-btn' onClick={() => this.onClear()}>
                            Clear
                        </Button>
                        <Button className='ticket-search-btn' onClick={() => this.onCancel()}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );

    }

}

export default AuditSearch;
