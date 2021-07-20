import React from 'react';
import Route from "react-router-dom/Route";
import Switch from "react-router-dom/Switch";
import Redirect from "react-router-dom/Redirect";
import './fonts/MyriadProRegular.otf';

import Notfound from "./components/notfound/notfound";
import RoleManagementComponent from './roles';
import LoginComponent from './components/login';
import UserManagementComponent from "./users";
import ResetPassword from "./resetpassword";
import ClaimProcessingCenterComponent from './Claims/claimsprocessingcenter';

import DashboardComponent from "./dashboard";
import PlayerSupport from "./Player/Home";
import PlayerReports from "./Player/Reports/Home";
import PlayerReportTable from "./playerreporttable";
import PlayerReportsCustom from "./playerreportscustom";
import ClaimSupportComponent from "./Claims/claimsupport";
import ClaimReportsQueriesComponent from "./Claims/claimreportsqueries";
import RejectClaimComponent from "./Claims/rejectedClaim";
import ClaimUpdateComponent from "./Claims/claimupdate";
import ClaimResearchComponent from "./Claims/claimresearch";


import ClaimDetailsEditableComponent from "./Claims/claimdetailseditable";
import ClaimDetailsReadOnlyComponent from "./Claims/claimdetailsreadonly";
import ClaimReportsComponent from "./Claims/claimreports";
import ClaimReportsCustomComponent from "./Claims/claimreportscustom";
import ClaimDetailsComponent from "./Claims/claimDetails";
import ClaimPaymentHistoryComponent from "./Claims/claimPaymentHistory";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SystemDashboardComponent from "./systemdashboard";
import SystemStatsComponent from "./systemstats";
import SystemDetailsComponent from "./systemdetails";
import ComingSoonComponent from "./Misc/ComingSoon";
import PlayerSearchGenericComponent from "./Player/Search";
import PlayerHubComponent from "./Player/Hub";
import ActionAuditComponent from "./users/ActionAudit";
import SecurityHomeComponent from "./SecurityHome";
import FrequentCasherComponent from "./FrequentCasher";
import MFAComponent from "./components/login/MFA";
import MFAPolicyComponent from "./Admin/MFAPolicy";
import SettingsHubComponent from "./Admin/Settings/Hub";
import FinanceComponent from "./Finance";
import ACHActivityComponent from "./Finance/ACHActivity";
import ACHActivityBatchDetailComponent from "./Finance/ACHActivityBatchDetail";
import ACHActivityRejectDetailComponent from "./Finance/ACHActivityRejectDetail";
import DailyReconciliationReportComponent from "./Finance/DailyReconciliationReport";
import Location  from "./pages/src/components/Home/Location";
import ChooseYourCoupon  from "./pages/src/components/Home/ChooseYourCoupon";
import CouponDetails  from "./pages/src/components/Home/CouponDetails";
import FindPrescriptionHome  from "./pages/src/components/Home/FindPrescriptionHome";
import Home  from "./pages/src/components/Home";
import './globals.css';
import { rootStore } from './store/RootStore';
import { PlayerStore } from './store/PlayerStore';

const PrivateRoute = ({component: Component, ...rest}) => {
        const authed = localStorage.getItem('userName');
        let  enviroment = <Route
        {...rest}
        
        render={(props) => authed
            ? <Component {...props} />
            : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />;  
      
    return ( enviroment )
}
const Routes = props => {
    const playerStore = new PlayerStore(rootStore);
   
    return (
    <Switch>
            <Route exact path="/" component={LoginComponent} />
            
            <Route path='/src/components/home'>
                <Home  playerStore ={playerStore}/>
            </Route>
            <Route path='/src/components/location' > 
                <Home  router={{component:'location'}} />
            </Route>
            <Route exact path="/login" component={LoginComponent} />
            <PrivateRoute path="/usermanagement" component={(props) => <UserManagementComponent title="User Management" {...props} showBackButton={true} />} />
            <PrivateRoute path="/rolemanagement" component={(props) => <RoleManagementComponent title="Role Management" {...props} showBackButton={true} />} />
            <PrivateRoute path='/dashboard' component={(props) => <DashboardComponent title="Home" showBackButton={false} {...props}/>} />
            <PrivateRoute path="/playersupport" component={(props) => <PlayerSupport title="Player Support" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/table" component={(props) => <PlayerReportTable title="Player Reports - Table" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/customtable" component={(props) => <PlayerReportTable title="Player Reports - Custom" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/locked" component={(props) => <PlayerReportTable title="Player Reports - Locked Accounts" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/idfailed" component={(props) => <PlayerReportTable title="Player Reports - Failed Identity Verification" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/noidcheck" component={(props) => <PlayerReportTable title="Player Reports - Incomplete Player Registration" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports/custom" component={(props) => <PlayerReportsCustom title="Player Reports - Custom" {...props} showBackButton={true} />} />
            <PrivateRoute path="/playerreports" component={(props) => <PlayerReports title="Player Reports" {...props} showBackButton={true} />} />
            <Route path="/setpassword/:token/:username" component={ResetPassword} />
            <PrivateRoute path="/setpassword/:token/:username" component={ResetPassword} />

            <PrivateRoute path="/user/audit/:id" component={(props) => <ActionAuditComponent {...props} showBackButton={true} />} />

            {/*Player Routes*/}
            <PrivateRoute path="/player/search" component={(props) => <PlayerSearchGenericComponent title="Player Search" {...props} showBackButton={true} />} />

            {/*Claim Routes*/}
            <PrivateRoute path="/claimsupport" component={(props) => <ClaimSupportComponent title="Claim Support" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/research" component={(props) => <ClaimResearchComponent title="Claim Search - View" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/edit/:id" component={(props) => <ClaimDetailsEditableComponent title="Update Claim" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/view/:id" component={(props) => <ClaimDetailsReadOnlyComponent title="Claim Details" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/process" component={(props) => <ClaimProcessingCenterComponent title="Claim Processing Center" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/search/reportsandqueries" component={(props) => <ClaimReportsQueriesComponent title="Claim Reports/Queries" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/reject" component={(props) => <RejectClaimComponent title="Rejected Claims" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/check" component={(props) => <RejectClaimComponent title="Claims Check Request" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/update" component={(props) => <ClaimUpdateComponent title="Claim Search - Update" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/reports" component={(props) => <ClaimReportsComponent title="Claim Reports" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/reports/custom" component={(props) => <ClaimReportsCustomComponent title="Claim Reports - Custom" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/:id/paymenthistory" component={(props) => <ClaimPaymentHistoryComponent title="Transaction History" {...props} showBackButton={true} />} />
            <PrivateRoute path="/claim/:id" component={(props) => <ClaimDetailsComponent title="Claim Details" {...props} showBackButton={true} />} />

            {/*System Support Routes*/}
            <PrivateRoute path="/system/dashboard" component={(props) => <SystemDashboardComponent title="System Dashboard" {...props} showBackButton={true} />} />
            <PrivateRoute path="/system/stats" component={(props) => <SystemStatsComponent title="System Stats" {...props} showBackButton={true} />} />
            <PrivateRoute path="/system/details" component={(props) => <SystemDetailsComponent title="System Details" {...props} showBackButton={true} />} />
            <PrivateRoute path="/player/hub" component={(props) => <PlayerHubComponent{...props} showBackButton={true} />} />

            {/*Security Home page*/}
            <PrivateRoute path="/security/home" component={(props) => <SecurityHomeComponent title="Security" {...props} showBackButton={true} />} />
            <PrivateRoute path="/security/frequentcasher" component={(props) => <FrequentCasherComponent title="Frequent Casher" {...props} showBackButton={true} />} />

            {/*Settings*/}
            <PrivateRoute path="/admin/settings/mfa" component={(props) => <MFAPolicyComponent title="Multi-Factor Auth Bypass Rules" {...props} showBackButton={true} />} />
            <PrivateRoute path="/admin/settings" component={(props) => <SettingsHubComponent title="Settings" {...props} showBackButton={true} />} />
            <PrivateRoute path="/login/mfa" component={MFAComponent} />

            {/*Finance*/}
            <PrivateRoute path="/finance/claims/dailyreconciliation" component={(props) => <DailyReconciliationReportComponent title="Mobile Claims Daily Reconciliation Report" {...props} showBackButton={true} />} />} />
            <PrivateRoute path="/finance/claims/reject/details" component={(props) => <ACHActivityRejectDetailComponent title="Reject Details" {...props} showBackButton={true} />} />} />
            <PrivateRoute path="/finance/claims/batch/details" component={(props) => <ACHActivityBatchDetailComponent title="Batch Details" {...props} showBackButton={true} />} />} />
            <PrivateRoute path="/finance/claims/transactions" component={(props) => <ACHActivityComponent title="ACH Activity" {...props} showBackButton={true} />} />} />
            <PrivateRoute path="/finance" component={(props) => <FinanceComponent title="Finance/Payments" {...props} showBackButton={true} />} />} />

            {/*Misc*/}
            <PrivateRoute path="/comingsoon" component={(props) => <ComingSoonComponent {...props} showBackButton={true} />} />
            <PrivateRoute component={Notfound} />

    </Switch>
)};

export default Routes


