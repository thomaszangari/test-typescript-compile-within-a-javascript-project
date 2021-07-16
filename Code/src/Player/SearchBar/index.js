import React from "react";
import {Button} from "react-bootstrap";
import AppTextbox from "../../AppTextbox";
import {inject} from "mobx-react";

@inject('playerStore')
class PlayerSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            DOB: '',
            isValidEmail: false,
            isValidPhone: false,
            isValidZip: false,
            startDate: null,
            playerId: ''
        }
    }

    componentDidMount() {

        const firstName = localStorage.getItem('searchFirstName');
        const lastName = localStorage.getItem('searchLastName');
        const phone = localStorage.getItem('phone');
        const email = localStorage.getItem('email');
        const playerId = localStorage.getItem('playerId');

        if(firstName || lastName || phone || email || playerId) {

            localStorage.removeItem('searchFirstName');
            localStorage.removeItem('searchLastName');
            localStorage.removeItem('phone');
            localStorage.removeItem('email');
            localStorage.removeItem('playerId');
            this.setState({
                    firstName: firstName || '',
                    lastName: lastName || '',
                    email: email || '',
                    phone: phone || '',
                    playerId: playerId || ''
                }, () =>this.onSearch()
            );

        }

    }

    handleInputChange = (e, stateName) => {
        if (stateName === 'firstName' || stateName === 'lastName') {
            const regExp = /^[A-Za-z]+$/;
            if (e.target.value === '' || (regExp.test(e.target.value))) {
                this.setState({[stateName]: e.target.value})
            }
        } else if (stateName === 'email') {
            const isValid = e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            this.setState({[stateName]: e.target.value, isValidEmail: !!isValid});
        } else if (stateName === 'phone') {
            const regExp = /^[0-9\b]+$/;
            if (e.target.value === '' || (regExp.test(e.target.value))) {
                this.setState({[stateName]: e.target.value, isValidPhone: e.target.value.length === 10})
            }
        } else {
            this.setState({[stateName]: e.target.value});
        }
    }

    onSearch = () => {
        const {firstName, lastName, email, phone, playerId} = this.state;

        localStorage.setItem('searchFirstName', firstName);
        localStorage.setItem('searchLastName', lastName);
        localStorage.setItem('searchPhone', phone);
        localStorage.setItem('searchEmail', email);
        localStorage.setItem('playerId', playerId);

        this.props.handleSearchClick(firstName, lastName, phone, email, playerId);
    }

    onClear = () => {
        this.setState({firstName: '',  lastName: '', email: '', phone: '', playerId: ''},() => this.props.playerStore.clearPlayerSearchResults());
    }

    render() {
        const {firstName, lastName, email, phone, isValidEmail, isValidZip, isValidPhone, playerId} = this.state;
        let isDisabled = true;
        // if((firstName || lastName || ssn || zipcode || email || startDate) && isValidEmail && (zipcode.length === 4 || zipcode.length === 0)) {
        if (email) {
            isDisabled = !isValidEmail;
        } else if (phone) {
            isDisabled = !(isValidPhone);
        } else if ((firstName || lastName) || playerId) {
            isDisabled = false
        }
        const {tableHeader, userList} = this.props;

        return (
            <>
                <div className='search-criteria'>
                    <div>
                        <div className='player-search-label'>First Name</div>
                        <AppTextbox type='text' placeholder='First Name ' value={firstName}
                                    onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                    </div>
                    <div>
                        <div className='player-search-label'>Last Name</div>
                        <AppTextbox type='text' placeholder='Last Name ' value={lastName}
                                    onChange={(e) => this.handleInputChange(e, 'lastName')}/>
                    </div>
                    <div>
                        <div className='player-search-label'>Phone</div>
                        <AppTextbox type='text' placeholder='Phone' value={phone} maxlength='10'
                                    onChange={(e) => this.handleInputChange(e, 'phone')}/>
                        {
                            !isValidPhone && phone.length
                                ? <div className='player-invalid-email'>Phone should be 10 digit</div>
                                : null
                        }
                    </div>
                    <div>
                        <div className='player-search-label'>Email</div>
                        <AppTextbox type='text' placeholder='Email' value={email}
                                    onChange={(e) => this.handleInputChange(e, 'email')}/>
                        {
                            !isValidEmail && email.length
                                ? <div className='player-invalid-email'>Invalid Email</div>
                                : null
                        }
                    </div>
                    <div>
                        <Button disabled={isDisabled} className='player-search-btn' onClick={() => this.onSearch()}>
                            Search
                        </Button>
                        <Button className='player-search-btn' onClick={() => this.onClear()}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div className='player-search-id'>
                    <div className='player-search-label'>Player ID</div>
                    <AppTextbox type='text' placeholder='Player ID' value={playerId}
                                onChange={(e) => this.handleInputChange(e, 'playerId')}/>
                </div>
            </>
        );
    }

}

export default PlayerSearch;

