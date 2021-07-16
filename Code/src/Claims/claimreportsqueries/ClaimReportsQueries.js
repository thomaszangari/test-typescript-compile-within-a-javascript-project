import React from "react";
import './ClaimReportsQueries.css';
import {checkRenderPermissions} from "../../helpers";
import {permissions} from "../../constants";


class ClaimReportsQueries extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    renderClaimReportsQueries() {

        return (
            <div className='container-fluid'>

            </div>
        );
    }

    render() {
        var renderObj;

        if(checkRenderPermissions(permissions.SEE_CLAIM_SUPPORT, JSON.parse(localStorage.getItem('userpolicies'))) &&
            checkRenderPermissions(permissions.SEE_CLAIM_REPORTS_QUERIES, JSON.parse(localStorage.getItem('userpolicies')))){
            renderObj = this.renderClaimReportsQueries();
        }
        else{
            renderObj = <h1 class='unauthorized-header'>You do not have permission to view this page! Please contact your System Administrator!</h1>
        }

        return (
            renderObj
        );
    }


}

export default ClaimReportsQueries;
