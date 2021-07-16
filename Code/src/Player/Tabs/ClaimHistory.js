import React from "react";
import {inject, observer} from "mobx-react";
import './Tabs.css';
import ReactTable from "../../PaginatedTable/ReactTable";
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";

@inject('playerStore')
@observer
class ClaimHistory extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.playerStore.selectedPlayerID) {
            this.props.playerStore.fetchAllClaims();
        }
    }

    handleClaimDetailClick = claimData => {
        this.props.playerStore.setSelectedClaim(claimData, this.navigateToClaimDetails);
    }

    navigateToClaimDetails = () => {
        const id = this.props.playerStore.selectedClaimId;
        this.props.history.push('/claim/'+id);
    }

    render() {
        const {claimHistoryTableHeader, claimHistoryTableRows, selectedPlayerID} = this.props.playerStore;
        let tableRows = JSON.parse(JSON.stringify(claimHistoryTableRows));
        let tableHeaders = JSON.parse(JSON.stringify(claimHistoryTableHeader));
        if(tableHeaders && tableRows) {
            const isViewPermission = checkRenderPermissions(permissions.CAN_SEE_CLAIM_DETAILS,
                JSON.parse(localStorage.getItem('userpolicies')));
            if(isViewPermission) {
                tableRows = tableRows.map(row => {
                    row.view = <a onClick={() => this.handleClaimDetailClick(row)} className='claim-tab-link'>View</a>;
                    return row;
                });
                tableHeaders.push({key: 'view', label: 'View'});
            }
        }
        if(!selectedPlayerID && !tableHeaders && !tableRows) {
            return (<div className='player-search-container container-fluid'>
                <div className='no-data-message'>Error loading data...go back</div>
            </div>);
        }

        return (
            <div className='player-search-container container-fluid'>
                {
                    tableHeaders && tableRows
                        ? <ReactTable tableHeader={tableHeaders}
                                      rowData={tableRows}
                                      noDataMessage='Player has no Claims'
                                      className='update-user-table'/>
                        : null
                }
            </div>

        );

    }

}

export default ClaimHistory;
