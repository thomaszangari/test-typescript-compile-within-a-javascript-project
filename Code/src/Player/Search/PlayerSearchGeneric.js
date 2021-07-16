import React from "react";
import {inject, observer} from "mobx-react";
import PlayerSearch from "../SearchBar";
import './PlayerSearchGeneric.css';
import ReactTable from "../../PaginatedTable/ReactTable";

@inject('playerStore')
@observer
class PlayerSearchGeneric extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            tableHeader: [],
            showToast: false
        }
    }

    componentDidMount() {
        this.props.playerStore.clearTicketHistorySearchResults()
    }

    handleSelectClick = (event, id) => {
        event.preventDefault();
        this.props.playerStore.setSelectedPlayerDetails(id);
        this.props.history.push(`/player/hub/${id}`);
    }

    onSearchClick = (firstName = '', lastName = '', phone = '', email = '', playerId='') => {
        if(playerId && playerId !== '') {
            this.props.playerStore.getPlayerDetails(playerId);
        } else if (email && email !== '') {
            this.props.playerStore.getPlayerDetails(email);
        } else {
            let queryParams = '?';
            if (firstName && firstName !== '') {
                queryParams += `firstName=${firstName}`
            }
            if (lastName && lastName !== '') {
                if (queryParams.endsWith("?"))
                    queryParams += `lastName=${lastName}`
                else
                    queryParams += `&lastName=${lastName}`
            }
            if (phone && phone !== '') {
                if (queryParams.endsWith("?"))
                    queryParams += `phone=${phone}`
                else
                    queryParams += `&phone=${phone}`
            }
            this.props.playerStore.searchPlayers(queryParams);
        }

    }

    onToastClose = () => {
        this.props.playerStore.setToast(false);
    }

    renderPlayerSearchResetPW() {
        const {tableHeader, tableRows, showToast, errorMessage} = this.props.playerStore;
        let address2 = '';
        const rows = tableRows && tableRows.map((d, index) => {
            d.idField = index + 1;
            // If the address2 field comes as null, then display empty string
            // address2 = (d.address2 === null || d.address2.trim() === '') ? '' : `${d.address2},`;
            if(!d.hasOwnProperty('address')) {
                address2 = d.address2 ? d.address2.trim(): '';
                d.address = `${d.address1 || ''}, ${address2} ${d.city || ''}, ${d.state || ''}, ${d.zip5 || ''}`;
            }

            d.select =
                <a onClick={(e) => this.handleSelectClick(e, d.playerId)} href='' className='select-link'>Select</a>;
            return d;
        });
        return (
            <div className='player-search-container container-fluid'>
                <div className='player-search-panel player-search-child'>
                    <PlayerSearch tableHeader={tableHeader} userList={rows} handleSearchClick={this.onSearchClick}/>
                </div>
                {
                    rows && rows.length > 0 && tableHeader
                        ? <ReactTable tableHeader={tableHeader} rowData={rows} className='update-user-table'/>
                        : null
                }
            </div>
        );

    }

    render() {
        let renderObj;
        if (true) {
            renderObj = this.renderPlayerSearchResetPW();
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

export default PlayerSearchGeneric;
