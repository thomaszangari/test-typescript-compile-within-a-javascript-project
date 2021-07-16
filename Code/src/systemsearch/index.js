import React from "react";
import DatePicker from "react-datepicker";
import {Button} from "react-bootstrap";
import AppTextbox from "../AppTextbox";
import {SystemStatsCategories} from "../Constants/SystemStatsCategories";

import './SystemSearch.css';
import { categories } from "../Constants/SystemDashCategories";

class SystemSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [{
                id: 1,
                value: 'Tickets'
            }, {
                id: 2,
                value: 'Ticket Accepted'
            }, {
                id: 3,
                value: 'Ticket Rejected'
            }, {
                id: 4,
                value: 'Winner'
            }, {
                id: 5,
                value: 'Non Winner'
            }, {
                id: 6,
                value: 'Registration'
            }, {
                id: 7,
                value: 'KYC-Accepted'
            }, {
                id: 8,
                value: 'KYC-Rejected'
            }, {
                id: 9,
                value: 'Environment'
            }, {
                id: 10,
                value: 'API Errors'
            }, {
                id: 11,
                value: 'Errors'
            }],
            startDate: '',
            endDate: '',
            tempStart: null,
            tempEnd: null,
            category: '',
            selectedCategory: 'winner',
            searchText: ''
        }
    }

    componentDidMount() {

    }

    handleInputChange = (e, stateName) => {
        if (stateName === 'firstName' || stateName === 'lastName') {
            const regExp = /^[A-Za-z]+$/;
            if (e.target.value === '' || (regExp.test(e.target.value))) {
                this.setState({[stateName]: e.target.value})
            }
        } else {
            this.setState({[stateName]: e.target.value});
        }
    }

   
    handleSelectChange = (e, stateName) => { 
        //debugger;
        const value = e.target.value;
    
        this.setState({'category': value});
    
    }

    onSearch = () => {
        const {selectedCategory, startDate, endDate, searchText, category} = this.state;
        this.props.handleSearchClick(category, startDate, endDate, searchText);
    }

    render() {
        const {category, startDate, endDate, tempStart, tempEnd, categories, searchText} = this.state;
        const {tableHeader, userList} = this.props;
        return (
            <div>
                <div className='search-criteria'>
                    <div>
                        <div className='system-search-label'>Category</div>
                        <select value={category} onChange={(e) => this.handleSelectChange(e, 'category')}>
                            {
                                SystemStatsCategories.map(g => {
                                    return <option value={g}>{g}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='system-search-label'>Start Date</div>
                        <DatePicker maxDate={new Date()}
                                    isClearable={false}
                                    placeholderText="Start Date"
                                    selected={startDate}
                                    onChange={selected => this.setState({startDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='system-search-label'>End Date</div>
                        <DatePicker maxDate={new Date()}
                                    minDate={startDate}
                                    isClearable={false}
                                    placeholderText="End Date"
                                    selected={endDate}
                                    onChange={selected => this.setState({endDate: new Date(selected)})}/>
                    </div>
                    <div>
                        <div className='system-search-label'>Search Text</div>
                        <AppTextbox type='text' placeholder='Search Text' value={searchText}
                                    onChange={(e) => this.handleInputChange(e, 'searchText')}/>
                    </div>
                    <div>
                        <Button disabled={false} className='system-search-btn' onClick={() => this.onSearch()}>
                            Filter
                        </Button>
                    </div>
                </div>
            </div>
        );

    }

}

export default SystemSearch;
