import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import SystemDashboard from "./SystemDashboard";
import "react-datepicker/dist/react-datepicker.css";
import {withRouter} from "react-router";

const SystemDashboardComponent = AuthLayoutHOC(SystemDashboard);

export default withRouter(SystemDashboardComponent);