import React from "react";
import AppTextbox from "../../AppTextbox";
import DatePicker from "react-datepicker";
import {Button} from "react-bootstrap";

class ClaimSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            drawDate: null,
            ticketStatus: '',
            paymentStatus: '',
            ticketStatuses: [{
                id: 0,
                value: 'Select'
            }, {
                id: 1,
                value: 'TicketStatus1'
            }, {
                id: 2,
                value: 'TicketStatus2'
            }, {
                id: 3,
                value: 'TicketStatus3'
            }, {
                id: 4,
                value: 'TicketStatus4'
            }, {
                id: 5,
                value: 'TicketStatus5'
            }],
            paymentStatuses: [{
                id: 0,
                value: 'Select'
            }, {
                id: 1,
                value: 'PaymentStatus1'
            }, {
                id: 2,
                value: 'PaymentStatus2'
            }, {
                id: 3,
                value: 'PaymentStatus3'
            }, {
                id: 4,
                value: 'PaymentStatus4'
            }, {
                id: 5,
                value: 'PaymentStatus5'
            }]
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
        const val = Number(e.target.value);
        this.setState({[stateName]: val});
    }

    onSearch = () => {
        const {firstName, lastName, drawDate, ticketStatus, paymentStatus} = this.state;
        this.props.handleSearchClick(firstName, lastName, drawDate, ticketStatus, paymentStatus);
    }

    render() {
        const {firstName, lastName, drawDate, ticketStatus, paymentStatus, ticketStatuses, paymentStatuses} = this.state;

        // Conditions to activate the [Search]
        let isDisabled = true;
        if (paymentStatus) {
            isDisabled = false
        } else if (ticketStatus) {
            isDisabled = false
        } else if (drawDate) {
            isDisabled = false
        } else if (lastName) {
            isDisabled = false
        } else if (firstName) {
            if (lastName || drawDate || ticketStatus || paymentStatus) {
                isDisabled = false
            }
        }

        return (
            <div>
                <div className='search-criteria'>
                    <div>
                        <div className='claim-search-label'>First Name</div>
                        <AppTextbox type='text' placeholder='First Name ' value={firstName}
                                    onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                    </div>
                    <div>
                        <div className='claim-search-label'>Last Name</div>
                        <AppTextbox type='text' placeholder='Last Name ' value={lastName}
                                    onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                    </div>
                    <div>
                        <div className='claim-search-label'>Draw Date</div>
                        <DatePicker maxDate={new Date()}
                                    isClearable={false}
                                    placeholderText="Draw Date"
                                    selected={drawDate}
                                    onChange={date => this.setState({drawDate: date})}/>
                    </div>
                    <div>
                        <div className='claim-search-label'>Ticket Status</div>
                        <select value={ticketStatus} onChange={(e) => this.handleSelectChange(e, 'ticketStatus')}>
                            {
                                ticketStatuses.map(identifier => {
                                    return <option value={identifier.id}>{identifier.value}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='claim-search-label'>Payment Status</div>
                        <select value={paymentStatus} onChange={(e) => this.handleSelectChange(e, 'paymentStatus')}>
                            {
                                paymentStatuses.map(identifier => {
                                    return <option value={identifier.id}>{identifier.value}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <Button disabled={isDisabled} className='claim-search-btn' onClick={() => this.onSearch()}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        );

    }

}

export default ClaimSearch;
