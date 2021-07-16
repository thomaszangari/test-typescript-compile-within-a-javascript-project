import React from 'react';
import "./Tabs.css";
import {checkRenderPermissions} from "../../../helpers";
import {permissions} from "../../../constants";
import {Button} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import ReactTable from "../../../PaginatedTable/ReactTable";

@inject('settingsStore')
@observer
class MFABypassRule extends React.Component {

    constructor(props) {
        super(props);
    }

    editInboundRules = () => {
        this.props.history.push('/admin/settings/mfa');
    }

    componentDidMount() {
        this.props.settingsStore.getMyIPAddress();
        this.props.settingsStore.getMFABypassRules();
    }

    render() {

        const _header = <div className='user-table-header'>
            <div>Bypass Rules</div>
            {checkRenderPermissions(permissions.CAN_EDIT_MFA_BYPASS_RULES, JSON.parse(localStorage.getItem('userpolicies'))) ?
                <Button variant='primary' onClick={this.editInboundRules}>Edit Rules</Button> : null}
        </div>

        const tableHeader = [
            {key: 'source', label: 'Source'},
            {key: 'ip', label: 'IP Address'},
            {key: 'description', label: 'Description'}
        ];

        const {inboundRules} = this.props.settingsStore;

        /*        const userList = [{source: 'Custom', ip: '0.0.0.0', description: '-'},
                    {source: 'Custom', ip: '0.0.0.0', description: '-'},
                    {source: 'Custom', ip: '0.0.0.0', description: '-'}];*/

        // TO DO: Fix the IF condition
        if (true) {

            return (
                <div className='player-details-container container-fluid '>
                    <div className='player-details-panel'>
                        <div className='setting-table'>
                            <ReactTable header={_header} tableHeader={tableHeader} rowData={inboundRules}
                                        className='fixed_header'/>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className='player-details-container container-fluid'>
            <div className='no-data-message'>Error loading data...go back</div>
        </div>

    }

}

export default MFABypassRule;
